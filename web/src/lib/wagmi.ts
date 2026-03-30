import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

/** Public fallback so the app works if `NEXT_PUBLIC_SEPOLIA_RPC_URL` is missing on Vercel (still set your own for reliability). */
const DEFAULT_SEPOLIA_HTTPS = "https://rpc.sepolia.org";

const rpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim() || DEFAULT_SEPOLIA_HTTPS;
const wcRaw = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

/** WalletConnect Cloud project IDs are UUIDs; invalid values must not reach the connector (can throw at runtime). */
const WC_PROJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function buildConnectors() {
  const list = [injected()];
  if (wcRaw && WC_PROJECT_ID.test(wcRaw)) {
    try {
      list.push(
        walletConnect({
          projectId: wcRaw,
          showQrModal: true,
        }),
      );
    } catch (e) {
      console.warn("[FheloFund] WalletConnect connector skipped:", e);
    }
  }
  return list;
}

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: buildConnectors(),
  transports: {
    [sepolia.id]: http(rpc),
  },
  ssr: true,
});
