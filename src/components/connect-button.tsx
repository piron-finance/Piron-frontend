"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function ConnectButton() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isSignedIn) {
    return (
      <div className="flex gap-2">
        <Button asChild>
          <a href="/signin">Sign In</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/signup">Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => open()}>
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
