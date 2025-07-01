"use client";

import { Web3ModalProvider } from "@/contexts/web3modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Web3ModalProvider>{children}</Web3ModalProvider>;
}
