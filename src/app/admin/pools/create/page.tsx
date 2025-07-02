"use client";

import { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Info,
  AlertCircle,
  Calendar,
  DollarSign,
  Target,
  Percent,
  Building2,
  FileText,
  Clock,
  Shield,
  Users,
  CheckCircle,
} from "lucide-react";

interface CouponPayment {
  date: string;
  rate: number;
}

interface EscrowSigner {
  address: string;
  name: string;
}

const INSTRUMENT_TYPES = [
  { value: "DISCOUNTED", label: "Discounted (T-Bills, Commercial Paper)" },
  {
    value: "INTEREST_BEARING",
    label: "Interest Bearing (Bonds, Fixed Deposits)",
  },
];

const ASSET_TOKENS = [
  {
    value: "0x1234567890123456789012345678901234567890",
    label: "USDC",
    symbol: "USDC",
  },
  {
    value: "0x2345678901234567890123456789012345678901",
    label: "USDT",
    symbol: "USDT",
  },
  {
    value: "0x3456789012345678901234567890123456789012",
    label: "DAI",
    symbol: "DAI",
  },
];

export default function CreatePoolPage() {
  const [formData, setFormData] = useState({
    // Basic Pool Info
    name: "",
    symbol: "",
    asset: "",

    // Pool Configuration
    targetRaise: "",
    epochEndTime: "",
    maturityDate: "",
    discountRate: "",
    instrumentType: "DISCOUNTED",

    // Interest Bearing Configuration
    couponPayments: [] as CouponPayment[],

    // Escrow Configuration
    escrowSigners: [] as EscrowSigner[],
    requiredConfirmations: "2",

    // Additional Metadata
    issuer: "",
    description: "",
    riskLevel: "LOW",
    category: "",
    creditRating: "",
    minimumInvestment: "",
    series: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
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

  const addEscrowSigner = () => {
    setFormData((prev) => ({
      ...prev,
      escrowSigners: [...prev.escrowSigners, { address: "", name: "" }],
    }));
  };

  const removeEscrowSigner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      escrowSigners: prev.escrowSigners.filter((_, i) => i !== index),
    }));
  };

  const updateEscrowSigner = (
    index: number,
    field: keyof EscrowSigner,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      escrowSigners: prev.escrowSigners.map((signer, i) =>
        i === index ? { ...signer, [field]: value } : signer
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name) newErrors.name = "Pool name is required";
    if (!formData.symbol) newErrors.symbol = "Pool symbol is required";
    if (!formData.asset) newErrors.asset = "Asset token is required";
    if (!formData.targetRaise)
      newErrors.targetRaise = "Target raise amount is required";
    if (!formData.epochEndTime)
      newErrors.epochEndTime = "Funding end time is required";
    if (!formData.maturityDate)
      newErrors.maturityDate = "Maturity date is required";
    if (!formData.issuer) newErrors.issuer = "Issuer name is required";
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

    // Escrow validation
    if (formData.escrowSigners.length < 2) {
      newErrors.escrowSigners = "At least 2 escrow signers are required";
    }

    formData.escrowSigners.forEach((signer, index) => {
      if (!signer.address) {
        newErrors[`signer_address_${index}`] = "Signer address is required";
      }
      if (!signer.name) {
        newErrors[`signer_name_${index}`] = "Signer name is required";
      }
    });

    if (
      Number(formData.requiredConfirmations) < 2 ||
      Number(formData.requiredConfirmations) > formData.escrowSigners.length
    ) {
      newErrors.requiredConfirmations =
        "Required confirmations must be between 2 and the number of signers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would call the smart contract createPool function
      console.log("Creating pool with data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message and redirect
      alert("Pool created successfully!");
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Error creating pool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </div>

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
                  Pool Symbol *
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange("symbol", e.target.value)}
                  placeholder="e.g., NTB-Q3-25"
                  className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                />
                {errors.symbol && (
                  <p className="text-red-400 text-sm mt-1">{errors.symbol}</p>
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
                  <option value="VERY_LOW">Very Low</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="VERY_HIGH">Very High</option>
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

          {/* Escrow Configuration */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-orange-400" />
              <span>Escrow Configuration</span>
            </h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-400">
                  Escrow Signers * (Min 2 required)
                </label>
                <button
                  type="button"
                  onClick={addEscrowSigner}
                  className="flex items-center space-x-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Signer</span>
                </button>
              </div>

              {formData.escrowSigners.map((signer, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-slate-900/30 rounded-xl border border-slate-600/20"
                >
                  <input
                    type="text"
                    value={signer.name}
                    onChange={(e) =>
                      updateEscrowSigner(index, "name", e.target.value)
                    }
                    placeholder="Signer name"
                    className="px-4 py-2 bg-slate-800/50 border border-slate-600/20 rounded-lg text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={signer.address}
                      onChange={(e) =>
                        updateEscrowSigner(index, "address", e.target.value)
                      }
                      placeholder="0x..."
                      className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600/20 rounded-lg text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeEscrowSigner(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {errors.escrowSigners && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.escrowSigners}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Required Confirmations *
              </label>
              <input
                type="number"
                min="2"
                value={formData.requiredConfirmations}
                onChange={(e) =>
                  handleInputChange("requiredConfirmations", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 focus:border-orange-500/50 focus:outline-none"
              />
              {errors.requiredConfirmations && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.requiredConfirmations}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Number of signatures required for escrow transactions
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-slate-600/30 text-slate-300 rounded-xl hover:bg-slate-800/50 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 hover:from-red-500/90 hover:to-orange-500/90 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/15 disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? (
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
