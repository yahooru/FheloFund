import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

/** Public fallback if `NEXT_PUBLIC_SEPOLIA_RPC_URL` is unset (set your own RPC in production). */
const DEFAULT_SEPOLIA_HTTPS = "https://rpc.sepolia.org";

const rpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim() || DEFAULT_SEPOLIA_HTTPS;
const wcRaw = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

/** WalletConnect Cloud project IDs are UUIDs; skip connector if invalid (avoids runtime throws). */
const WC_PROJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const wcConnector =
  wcRaw && WC_PROJECT_ID.test(wcRaw)
    ? walletConnect({
        projectId: wcRaw,
        showQrModal: true,
      })
    : null;

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: wcConnector ? [injected(), wcConnector] : [injected()],
  transports: {
    [sepolia.id]: http(rpc),
  },
  ssr: true,
});
