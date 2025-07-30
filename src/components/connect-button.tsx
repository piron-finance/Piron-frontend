"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useEnsName, useEnsAvatar } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  User,
  LogOut,
  ChevronDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateAddress } from "@/lib/utils";
import { useState } from "react";

export function ConnectButton() {
  const { isSignedIn, user } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const { data: ensName } = useEnsName({
    address,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
  });

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url;
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, "_blank");
      }
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => openSignIn()}
          className="hidden sm:flex border-white/20 hover:border-white/40"
        >
          Sign In
        </Button>
        <Button
          onClick={() => openSignUp()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Wallet Connection */}
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 border-white/20 hover:border-white/40"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">
                {ensName || truncateAddress(address || "")}
              </span>
              <span className="md:hidden">Wallet</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-900 border-slate-700"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-white">
                {ensName || "Wallet Connected"}
              </p>
              <p className="text-xs text-slate-400">
                {truncateAddress(address || "")}
              </p>
              {chain && <p className="text-xs text-slate-400">{chain.name}</p>}
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={handleCopyAddress}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy Address"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleViewOnExplorer}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          onClick={() => open()}
          className="hidden sm:flex items-center gap-2 border-white/20 hover:border-white/40"
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
            <span className="hidden sm:inline font-medium text-white">
              {user?.fullName || user?.firstName || "User"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-slate-900 border-slate-700"
        >
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-white">{user?.fullName}</p>
            <p className="text-xs text-slate-400">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <DropdownMenuSeparator className="bg-slate-700" />

          {/* Mobile wallet connection */}
          <div className="sm:hidden">
            {isConnected ? (
              <DropdownMenuItem
                onClick={() => disconnect()}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => open()}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-slate-700" />
          </div>

          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
