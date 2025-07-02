"use client";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Web3ModalProvider } from "@/contexts/web3modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </ConvexClientProvider>
  );
}
