import type { AbiEvent, Log, PublicClient } from "viem";

/** Alchemy free tier (and some providers) allow at most ~10 blocks per eth_getLogs request. */
const BLOCKS_PER_CHUNK = 10n;

/** How far back to scan from latest (balance of coverage vs RPC calls). */
export const ACTIVITY_SCAN_BLOCKS = 2500n;

/** Parallel chunk requests per batch to stay under typical rate limits. */
const CONCURRENCY = 6;

function splitRange(fromBlock: bigint, toBlock: bigint): { from: bigint; to: bigint }[] {
  const out: { from: bigint; to: bigint }[] = [];
  let start = fromBlock;
  while (start <= toBlock) {
    const end =
      start + BLOCKS_PER_CHUNK - 1n <= toBlock ? start + BLOCKS_PER_CHUNK - 1n : toBlock;
    out.push({ from: start, to: end });
    start = end + 1n;
  }
  return out;
}

async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const part = await Promise.all(batch.map(fn));
    results.push(...part);
  }
  return results;
}

/**
 * Fetches logs in small block ranges so providers with strict limits (e.g. Alchemy free tier) succeed.
 */
export async function getLogsChunked(
  publicClient: PublicClient,
  args: {
    address: `0x${string}`;
    event: AbiEvent;
    fromBlock: bigint;
    toBlock: bigint;
  },
): Promise<Log[]> {
  const { address, event, fromBlock, toBlock } = args;
  if (fromBlock > toBlock) return [];

  const chunks = splitRange(fromBlock, toBlock);
  const arrays = await mapInBatches(chunks, CONCURRENCY, ({ from, to }) =>
    publicClient.getLogs({
      address,
      event,
      fromBlock: from,
      toBlock: to,
    }),
  );
  return arrays.flat() as Log[];
}
