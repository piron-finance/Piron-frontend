"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useCreatePool, CreatePoolFormData } from "@/hooks/useCreatePool";
import { ConnectButton } from "@/components/connect-button";
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Target,
  FileText,
  Users,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface CouponPayment {
  date: string;
  rate: number;
}

const INSTRUMENT_TYPES = [
  { value: "DISCOUNTED", label: "Discounted (T-Bills, Commercial Paper)" },
  {
    value: "INTEREST_BEARING",
    label: "Interest Bearing (Bonds, Fixed Deposits)",
  },
];

const ASSET_TOKENS = [
  // this should be based on current chain but not important for npw
  {
    value: "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98",
    label: "USDT (Morph Holesky)",
    symbol: "USDT",
  },
  {
    value: "0xEC33dC84aEC542694B490168250b62E53ce6DB17",
    label: "CNGN (Base Sepolia)",
    symbol: "CNGN",
  },
];

export default function CreatePoolPage() {
  const { isConnected, chain } = useAccount();
  const { createPool, isCreating, isSuccess, error, transactionHash } =
    useCreatePool();

  const [formData, setFormData] = useState<CreatePoolFormData>({
    name: "",
    asset: "",

    // Pool Configuration
    targetRaise: "",
    epochEndTime: "",
    maturityDate: "",
    discountRate: "",
    instrumentType: "DISCOUNTED",

    couponPayments: [] as CouponPayment[],

    issuer: "",
    spvAddress: "",
    description: "",
    riskLevel: "LOW",
    minimumInvestment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addCouponPayment = () => {
    setFormData((prev) => ({
      ...prev,
      couponPayments: [...prev.couponPayments, { date: "", rate: 0 }],
    }));
  };

  const removeCouponPayment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      couponPayments: prev.couponPayments.filter((_, i) => i !== index),
    }));
  };

  const updateCouponPayment = (
    index: number,
    field: keyof CouponPayment,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      couponPayments: prev.couponPayments.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Pool name is required";
    if (!formData.asset) newErrors.asset = "Asset token is required";
    if (!formData.targetRaise)
      newErrors.targetRaise = "Target raise amount is required";
    if (!formData.epochEndTime)
      newErrors.epochEndTime = "Funding end time is required";
    if (!formData.maturityDate)
      newErrors.maturityDate = "Maturity date is required";
    if (!formData.issuer) newErrors.issuer = "Issuer name is required";
    if (!formData.spvAddress) newErrors.spvAddress = "SPV address is required";
    else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.spvAddress)) {
      newErrors.spvAddress = "Invalid Ethereum address format";
    }
    if (!formData.description)
      newErrors.description = "Description is required";

    // Instrument type specific validation
    if (formData.instrumentType === "DISCOUNTED") {
      if (!formData.discountRate || Number(formData.discountRate) <= 0) {
        newErrors.discountRate =
          "Valid discount rate is required for discounted instruments";
      }
    } else if (formData.instrumentType === "INTEREST_BEARING") {
      if (formData.couponPayments.length === 0) {
        newErrors.couponPayments =
          "At least one coupon payment is required for interest bearing instruments";
      }

      formData.couponPayments.forEach((payment, index) => {
        if (!payment.date) {
          newErrors[`coupon_date_${index}`] = "Coupon date is required";
        }
        if (!payment.rate || payment.rate <= 0) {
          newErrors[`coupon_rate_${index}`] = "Valid coupon rate is required";
        }
      });
    }

    // Date validations
    const epochEnd = new Date(formData.epochEndTime);
    const maturity = new Date(formData.maturityDate);
    const now = new Date();

    if (epochEnd <= now) {
      newErrors.epochEndTime = "Funding end time must be in the future";
    }

    if (maturity <= epochEnd) {
      newErrors.maturityDate = "Maturity date must be after funding end time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createPool(formData);
    } catch (err: any) {
      console.error("Error creating pool:", err);
    }
  };

  // Show success state
  if (isSuccess && transactionHash) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Pool Created Successfully!
          </h1>
          <p className="text-slate-400 mb-6">
            Your investment pool has been deployed to the blockchain.
          </p>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 mb-6">
            <p className="text-sm text-slate-400 mb-2">Transaction Hash:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-green-400 bg-slate-900/50 px-3 py-1 rounded text-sm">
                {transactionHash}
              </code>
              {chain?.blockExplorers?.default && (
                <a
                  href={`${chain.blockExplorers.default.url}/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300"
          >
            Create Another Pool
          </button>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-slate-400 mb-6">
            Please connect your wallet to create investment pools.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Create New Pool
          </h1>
          <p className="text-lg text-slate-400">
            Deploy a new investment pool with tokenized securities
          </p>
          {chain && (
            <p className="text-sm text-slate-500 mt-2">
              Deploying on {chain.name}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">Error Creating Pool</p>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span>Basic Information</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Pool Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Nigerian Treasury Bills Q3 2025"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Asset Token *
                </label>
                <select
                  value={formData.asset}
                  onChange={(e) => handleInputChange("asset", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
                >
                  <option value="">Select asset token</option>
                  {ASSET_TOKENS.map((token) => (
                    <option key={token.value} value={token.value}>
                      {token.label} ({token.symbol})
                    </option>
                  ))}
                </select>
                {errors.asset && (
                  <p className="text-red-400 text-sm mt-1">{errors.asset}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => handleInputChange("issuer", e.target.value)}
                  placeholder="e.g., Central Bank of Nigeria"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.issuer && (
                  <p className="text-red-400 text-sm mt-1">{errors.issuer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  SPV Address *
                </label>
                <input
                  type="text"
                  value={formData.spvAddress || ""}
                  onChange={(e) =>
                    handleInputChange("spvAddress", e.target.value)
                  }
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.spvAddress && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.spvAddress}
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  The Special Purpose Vehicle address that will manage this pool
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe the investment opportunity..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Pool Configuration */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Target className="w-6 h-6 text-orange-400" />
              <span>Pool Configuration</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Target Raise Amount (USD) *
                </label>
                <input
                  type="number"
                  value={formData.targetRaise}
                  onChange={(e) =>
                    handleInputChange("targetRaise", e.target.value)
                  }
                  placeholder="5000000"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.targetRaise && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.targetRaise}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Minimum Investment (USD)
                </label>
                <input
                  type="number"
                  value={formData.minimumInvestment}
                  onChange={(e) =>
                    handleInputChange("minimumInvestment", e.target.value)
                  }
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Funding End Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.epochEndTime}
                  onChange={(e) =>
                    handleInputChange("epochEndTime", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.epochEndTime && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.epochEndTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Maturity Date *
                </label>
                <input
                  type="date"
                  value={formData.maturityDate}
                  onChange={(e) =>
                    handleInputChange("maturityDate", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.maturityDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.maturityDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Instrument Type *
                </label>
                <select
                  value={formData.instrumentType}
                  onChange={(e) =>
                    handleInputChange("instrumentType", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
                >
                  {INSTRUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Risk Level
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) =>
                    handleInputChange("riskLevel", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            {/* Instrument Type Specific Configuration */}
            {formData.instrumentType === "DISCOUNTED" && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Discount Rate (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountRate}
                  onChange={(e) =>
                    handleInputChange("discountRate", e.target.value)
                  }
                  placeholder="18.50"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.discountRate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.discountRate}
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  The discount rate determines the return for discounted
                  instruments
                </p>
              </div>
            )}

            {formData.instrumentType === "INTEREST_BEARING" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-slate-400">
                    Coupon Payments *
                  </label>
                  <button
                    type="button"
                    onClick={addCouponPayment}
                    className="flex items-center space-x-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Coupon</span>
                  </button>
                </div>

                {formData.couponPayments.map((payment, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-3">
                    <input
                      type="date"
                      value={payment.date}
                      onChange={(e) =>
                        updateCouponPayment(index, "date", e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-slate-900/30 border border-slate-600/20 rounded-lg text-slate-200 focus:border-orange-500/50 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={payment.rate}
                      onChange={(e) =>
                        updateCouponPayment(
                          index,
                          "rate",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Rate %"
                      className="w-32 px-4 py-2 bg-slate-900/30 border border-slate-600/20 rounded-lg text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeCouponPayment(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {errors.couponPayments && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.couponPayments}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 hover:from-red-500/90 hover:to-orange-500/90 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/15 disabled:transform-none disabled:shadow-none"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Pool...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Pool</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
