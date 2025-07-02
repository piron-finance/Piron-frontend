"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/configs";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

const metadata = {
  name: "Piron Finance",
  description: "Piron Finance - DeFi Investment Platform",
  url: "https://piron.finance",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

let web3ModalInitialized = false;

function initializeWeb3Modal() {
  if (!web3ModalInitialized) {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: true,
      enableOnramp: true,
      metadata,
    });
    web3ModalInitialized = true;
  }
}

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  initializeWeb3Modal();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
