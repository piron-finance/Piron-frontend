import { createConfig, http } from "wagmi";
import { baseSepolia, morphHolesky, arbitrum } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [baseSepolia, morphHolesky, arbitrum],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Piron Finance" }),
    walletConnect({ projectId }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [morphHolesky.id]: http(),
    [arbitrum.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
