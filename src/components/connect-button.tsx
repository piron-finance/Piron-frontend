"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ConnectButton() {
  const { isSignedIn, user } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => openSignIn()}
          className="hidden sm:flex"
        >
          Sign In
        </Button>
        <Button onClick={() => openSignUp()}>Sign Up</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Wallet Connection */}
      {isConnected ? (
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="hidden sm:flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <span className="md:hidden">Wallet</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => open()}
          className="hidden sm:flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      )}

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
            <span className="hidden sm:inline font-medium">
              {user?.fullName || user?.firstName || "User"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <DropdownMenuSeparator />

          {/* Mobile wallet connection */}
          <div className="sm:hidden">
            {isConnected ? (
              <DropdownMenuItem onClick={() => disconnect()}>
                <Wallet className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => open()}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </div>

          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
