/**
 * Never surface raw RPC URLs, API keys, or viem dumps to end users.
 */
export function friendlyActivityError(): string {
  return "We couldn’t load activity right now. This can happen when the network is busy. Wait a few seconds and try again.";
}

export function friendlyGenericError(): string {
  return "Something went wrong. Please try again.";
}

/** Wallet / contract write errors — keep short, no stack traces */
export function friendlyTxError(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message.toLowerCase();
    if (m.includes("rejected") || m.includes("denied") || m.includes("user rejected") || m.includes("user denied")) {
      return "You cancelled the request.";
    }
    if (m.includes("insufficient funds")) {
      return "Not enough Sepolia ETH for gas. Add test ETH from a faucet and try again.";
    }
  }
  return "The transaction could not be completed. Check your wallet and network, then try again.";
}

export function friendlyConnectError(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message.toLowerCase();
    if (m.includes("rejected") || m.includes("denied")) return "Connection was cancelled.";
  }
  return "Could not connect. Try again.";
}
