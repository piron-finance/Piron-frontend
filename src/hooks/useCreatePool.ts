import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { FACTORY_ABI } from "@/contracts/abis";
import { getContractAddress } from "@/contracts/addresses";

export interface CreatePoolFormData {
  name: string;
  asset: string;
  targetRaise: string;
  epochEndTime: string;
  maturityDate: string;
  discountRate: string;
  instrumentType: "DISCOUNTED" | "INTEREST_BEARING";
  couponPayments: Array<{ date: string; rate: number }>;
  issuer: string;
  description: string;
  riskLevel: string;
  minimumInvestment: string;
  spvAddress: string;
}

export function useCreatePool() {
  const { address, chain } = useAccount();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] });
    }
  }, [isSuccess, queryClient]);

  const createPool = async (formData: CreatePoolFormData) => {
    if (!address || !chain) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);
    setError(null);

    try {
      const factoryAddress = getContractAddress(chain.id, "FACTORY");

      // Convert form data to contract parameters
      const epochEndTime = new Date(formData.epochEndTime).getTime() / 1000;
      const maturityDate = new Date(formData.maturityDate).getTime() / 1000;
      const currentTime = Date.now() / 1000;

      const epochDuration = epochEndTime - currentTime;

      // Convert rates from percentage to basis points (multiply by 100)
      const discountRate = formData.discountRate
        ? Math.floor(parseFloat(formData.discountRate) * 100)
        : 0;

      // coupon data for interest bearing instruments
      const couponDates =
        formData.instrumentType === "INTEREST_BEARING"
          ? formData.couponPayments.map((payment) =>
              Math.floor(new Date(payment.date).getTime() / 1000)
            )
          : [];

      const couponRates =
        formData.instrumentType === "INTEREST_BEARING"
          ? formData.couponPayments.map(
              (payment) => Math.floor(payment.rate * 100) // Convert to basis points
            )
          : [];

      const spvAddress = formData.spvAddress;

      if (!spvAddress) {
        throw new Error("SPV address is required");
      }

      const poolConfig = {
        asset: formData.asset as `0x${string}`,
        instrumentType: formData.instrumentType === "DISCOUNTED" ? 0 : 1,
        instrumentName: formData.name,
        targetRaise: parseUnits(formData.targetRaise, 6),
        epochDuration: BigInt(Math.floor(epochDuration)),
        maturityDate: BigInt(Math.floor(maturityDate)),
        discountRate: BigInt(discountRate),
        spvAddress: spvAddress as `0x${string}`,
        couponDates: couponDates.map((date) => BigInt(date)),
        couponRates: couponRates.map((rate) => BigInt(rate)),
      };

      console.log("Creating pool with config:", poolConfig);

      await writeContract({
        address: factoryAddress,
        abi: FACTORY_ABI,
        functionName: "createPool",
        args: [poolConfig],
      });
    } catch (err: any) {
      console.error("Error creating pool:", err);
      setError(err.message || "Failed to create pool");
      setIsCreating(false);
    }
  };

  if (isSuccess || error) {
    if (isCreating) {
      setIsCreating(false);
    }
  }

  return {
    createPool,
    isCreating: isCreating || isPending || isConfirming,
    isSuccess,
    error,
    transactionHash: hash,
  };
}
