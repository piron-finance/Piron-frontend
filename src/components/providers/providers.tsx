import { ConvexClientProvider } from "./ConvexClientProvider";
import Web3ModalProvider from "./web3modal";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Web3ModalProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </Web3ModalProvider>
  );
}
