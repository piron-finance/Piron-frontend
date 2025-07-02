"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } =
    useConvexAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const createUser = useMutation(api.users.create);

  const userData = useQuery(
    api.users.getByClerkId,
    isSignedIn ? { clerkId: user?.id || "" } : "skip"
  );
  const adminAccess = useQuery(
    api.users.checkAdminAccess,
    isSignedIn ? { clerkId: user?.id || "" } : "skip"
  );

  const initializeUser = useCallback(async () => {
    if (!isSignedIn || !user) {
      return;
    }

    if (isConvexLoading) {
      return;
    }

    if (!isConvexAuthenticated) {
      return;
    }

    if (isInitialized) {
      return;
    }

    try {
      if (userData === undefined) {
        return;
      }

      if (userData === null) {
        // Get user details
        const userName = user.fullName || "Unknown";
        const userEmail = user.primaryEmailAddress?.emailAddress || "No email";

        const userId = await createUser({
          clerkId: user.id,
          name: userName,
          email: userEmail,
          image: user.imageUrl || "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        setLastError(null);
      }

      setIsInitialized(true);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      const err = error as Error;
      setLastError(err);

      // If we haven't exceeded max retries, we'll try again in the useEffect
      if (retryCount < 5) {
        setRetryCount((prevCount) => prevCount + 1);
        setIsInitialized(false);
      }
    }
  }, [
    isSignedIn,
    user,
    isConvexLoading,
    isConvexAuthenticated,
    userData,
    createUser,
    isInitialized,
    retryCount,
  ]);

  useEffect(() => {
    if (
      isSignedIn &&
      user &&
      !isConvexLoading &&
      isConvexAuthenticated &&
      userData !== undefined &&
      !isInitialized
    ) {
      // Delay retries slightly to give the system time to catch up
      const timeout = setTimeout(() => {
        initializeUser();
      }, retryCount * 1000); // Increasingly longer delays between retries

      return () => clearTimeout(timeout);
    }
  }, [
    isSignedIn,
    user,
    isConvexAuthenticated,
    isConvexLoading,
    userData,
    isInitialized,
    initializeUser,
    retryCount,
  ]);

  return {
    user,
    isSignedIn,
    isLoaded:
      isLoaded &&
      !isConvexLoading &&
      (!isSignedIn || isInitialized || retryCount >= 5),
    userData,
    adminAccess,
    lastError,
    initializationFailed: retryCount >= 5 && !isInitialized && isSignedIn,
  };
}
