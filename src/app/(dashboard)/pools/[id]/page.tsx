"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Building2,
  Shield,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Timer,
  ArrowUpRight,
  Info,
  PieChart,
  BarChart3,
  Activity,
} from "lucide-react";

// Mock data - in real app this would come from API
const poolsData = {
  "1": {
    id: "1",
    name: "Nigerian Treasury Bills",
    issuer: "Central Bank of Nigeria",
    expectedAPY: 24.2,
    targetRaise: 5000000,
    totalRaised: 4250000,
    maturityDate: "2025-09-15",
    timeRemaining: "6 days",
    minimumInvestment: 1000,
    participants: 1247,
    status: "FUNDING",
    category: "Government",
    description:
      "Short-term government securities backed by the full faith and credit of Nigeria",
    longDescription:
      "Nigerian Treasury Bills are short-term debt securities issued by the Central Bank of Nigeria on behalf of the Federal Government. These bills are considered one of the safest investment options in the Nigerian market, backed by the full faith and credit of the Federal Government of Nigeria. The bills have maturities of 91, 182, and 364 days, providing investors with flexible investment horizons.",
    riskLevel: "Very Low",
    creditRating: "AAA",
    issueDate: "2025-03-15",
    series: "Q3 2025 Series",
    instrumentType: "Treasury Bill",
    discountRate: 18.5,
    features: [
      "Government backed security",
      "High liquidity",
      "Tax advantages",
      "Competitive returns",
      "Low risk investment",
    ],
    risks: [
      "Interest rate risk",
      "Inflation risk",
      "Currency fluctuation (for foreign investors)",
    ],
  },
  "2": {
    id: "2",
    name: "MTN Group Corporate Bond",
    issuer: "MTN Group Limited",
    expectedAPY: 16.8,
    targetRaise: 15000000,
    totalRaised: 15000000,
    maturityDate: "2026-12-31",
    timeRemaining: "Active",
    minimumInvestment: 5000,
    participants: 892,
    status: "INVESTED",
    category: "Corporate",
    description:
      "24-month fixed-rate corporate bond from Africa's leading telecommunications company",
    longDescription:
      "MTN Group Corporate Bond is a 24-month fixed-rate bond issued by MTN Group Limited, Africa's largest telecommunications company. This bond offers investors exposure to the telecommunications sector with stable returns backed by MTN's strong market position and diversified revenue streams across multiple African markets.",
    riskLevel: "Low",
    creditRating: "AA+",
    issueDate: "2024-12-01",
    series: "24-Month Fixed Rate",
    instrumentType: "Corporate Bond",
    discountRate: 0,
    features: [
      "Leading telecom company",
      "Diversified revenue streams",
      "Strong market position",
      "Fixed-rate returns",
      "Quarterly coupon payments",
    ],
    risks: [
      "Corporate credit risk",
      "Telecommunications sector risk",
      "Regulatory changes",
      "Currency fluctuation",
    ],
  },
  "3": {
    id: "3",
    name: "Dangote Commercial Paper",
    issuer: "Dangote Industries Limited",
    expectedAPY: 21.5,
    targetRaise: 8500000,
    totalRaised: 2100000,
    maturityDate: "2025-06-30",
    timeRemaining: "12 days",
    minimumInvestment: 2500,
    participants: 634,
    status: "FUNDING",
    category: "Commercial",
    description:
      "180-day commercial paper from Nigeria's largest industrial conglomerate",
    longDescription:
      "Dangote Commercial Paper is a 180-day short-term debt instrument issued by Dangote Industries Limited, Nigeria's largest industrial conglomerate. This commercial paper provides investors with exposure to Nigeria's industrial sector through one of the continent's most successful business groups, with operations spanning cement, sugar, salt, and other essential commodities.",
    riskLevel: "Medium",
    creditRating: "A+",
    issueDate: "2025-03-25",
    series: "180-Day Term",
    instrumentType: "Commercial Paper",
    discountRate: 20.0,
    features: [
      "Industrial diversification",
      "Market leadership",
      "Strong cash flows",
      "Short-term maturity",
      "Competitive discount rate",
    ],
    risks: [
      "Industrial sector volatility",
      "Commodity price risk",
      "Working capital needs",
      "Economic conditions",
    ],
  },
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "FUNDING":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "INVESTED":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "MATURED":
      return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
  }
};

export default function PoolDetailPage() {
  const params = useParams();
  const poolId = params.id as string;
  const pool = poolsData[poolId as keyof typeof poolsData];
  const [investmentAmount, setInvestmentAmount] = useState("");

  if (!pool) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-100 mb-3">
            Pool Not Found
          </h3>
          <p className="text-slate-400 text-lg mb-6">
            The investment pool you're looking for doesn't exist.
          </p>
          <Link
            href="/pools"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white font-semibold rounded-xl hover:from-purple-500/90 hover:to-pink-500/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pools</span>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (pool.totalRaised / pool.targetRaise) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/pools"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pools</span>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-4xl font-bold text-slate-100">{pool.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(pool.status)}`}
              >
                {pool.status}
              </span>
            </div>
            <p className="text-xl text-slate-400 mb-2">{pool.issuer}</p>
            <p className="text-slate-500">
              {pool.series} • {pool.instrumentType}
            </p>
          </div>

          <div className="text-right bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-2xl p-6 border border-slate-600/20">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-300/90 to-pink-300/90 bg-clip-text mb-1">
              {pool.expectedAPY}%
            </div>
            <div className="text-sm text-slate-400 font-medium">
              Expected APY
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Stats */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              Pool Overview
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-emerald-400/80" />
                </div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {formatCurrency(pool.minimumInvestment)}
                </div>
                <div className="text-sm text-slate-400">Min Investment</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-sky-400/80" />
                </div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {pool.participants.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Investors</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-violet-400/80" />
                </div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {new Date(pool.maturityDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-slate-400">Maturity</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-amber-400/80" />
                </div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {pool.category}
                </div>
                <div className="text-sm text-slate-400">Type</div>
              </div>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100">
                Funding Progress
              </h2>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-200">
                  {progress.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400">Complete</div>
              </div>
            </div>

            <div className="w-full bg-slate-700/50 rounded-full h-4 mb-6">
              <div
                className="h-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {formatCurrency(pool.totalRaised)}
                </div>
                <div className="text-sm text-slate-400">Raised</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-200 mb-1">
                  {formatCurrency(pool.targetRaise)}
                </div>
                <div className="text-sm text-slate-400">Target</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              About This Pool
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {pool.longDescription}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {pool.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-slate-300"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Risk Factors
                </h3>
                <ul className="space-y-2">
                  {pool.risks.map((risk, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-slate-300"
                    >
                      <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Panel */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6 sticky top-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              Invest in This Pool
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min: ${formatCurrency(pool.minimumInvestment)}`}
                    className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600/20 rounded-xl text-slate-200 placeholder-slate-500 focus:border-purple-500/50 focus:outline-none"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    USD
                  </div>
                </div>
              </div>

              {investmentAmount && (
                <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-600/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Expected Return</span>
                    <span className="text-slate-200 font-semibold">
                      {formatCurrency(
                        parseFloat(investmentAmount) * (pool.expectedAPY / 100)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total at Maturity</span>
                    <span className="text-emerald-400 font-semibold">
                      {formatCurrency(
                        parseFloat(investmentAmount) *
                          (1 + pool.expectedAPY / 100)
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500/90 hover:to-pink-500/90 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/15">
              <span>Invest Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{pool.timeRemaining} remaining</span>
              </div>
            </div>
          </div>

          {/* Pool Details */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/40 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              Pool Details
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date</span>
                <span className="text-slate-200 font-semibold">
                  {new Date(pool.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Credit Rating</span>
                <span className="text-emerald-400 font-semibold">
                  {pool.creditRating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Level</span>
                <span className="text-slate-200 font-semibold">
                  {pool.riskLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Discount Rate</span>
                <span className="text-slate-200 font-semibold">
                  {pool.discountRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
