"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { PropsWithChildren } from "react";
import { useAuth as useCustomAuth } from "@/hooks/useAuth";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not defined. Please set this environment variable in your .env.local file"
  );
}

const convexClient = new ConvexReactClient(convexUrl);

function AuthInitializer({ children }: PropsWithChildren) {
  useCustomAuth();
  return <>{children}</>;
}

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      <AuthInitializer>{children}</AuthInitializer>
    </ConvexProviderWithClerk>
  );
}
