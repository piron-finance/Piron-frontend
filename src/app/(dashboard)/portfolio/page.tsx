"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
  Calendar,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  Building2,
  Percent,
  AlertCircle,
  CheckCircle,
  Timer,
  Receipt,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
  UserPosition,
  Pool,
  PoolStatus,
  InstrumentType,
  RiskLevel,
  ApprovalStatus,
  CouponPayment,
} from "@/types";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
  calculateAPY,
  getPoolStatusColor,
  getPoolStatusLabel,
  getRiskLevelColor,
  getInstrumentTypeLabel,
} from "@/lib/utils";

const mockPortfolioData = {
  totalInvested: "98500",
  currentValue: "125750",
  totalReturns: "27250",
  pendingCoupons: "2150",
  availableForWithdrawal: "18420",
};

const mockPositions: (UserPosition & { pool: Pool })[] = [
  {
    _id: "pos1",
    userId: "user1",
    poolId: "1",
    contractAddress: "0x1234567890123456789012345678901234567890",
    sharesOwned: "25000",
    assetsDeposited: "25000",
    depositTime: Date.now() - 7776000000,
    currentValue: "31200",
    expectedReturn: "31875",
    discountEarned: "6875",
    createdAt: Date.now() - 7776000000,
    updatedAt: Date.now() - 86400000,
    pool: {
      _id: "1",
      contractAddress: "0x1234567890123456789012345678901234567890",
      managerAddress: "0x2345678901234567890123456789012345678901",
      escrowAddress: "0x3456789012345678901234567890123456789012",
      name: "US Treasury Bills Q4 2024",
      symbol: "USTB-Q4",
      asset: "USDC",
      instrumentType: InstrumentType.DISCOUNTED,
      status: PoolStatus.INVESTED,
      targetRaise: "5000000",
      totalRaised: "5000000",
      actualInvested: "4750000",
      discountRate: 850,
      epochEndTime: Date.now() - 2592000000,
      maturityDate: Date.now() + 5184000000,
      issuer: "US Treasury",
      riskLevel: RiskLevel.LOW,
      minInvestment: "1000",
      description:
        "Short-term government securities backed by the full faith and credit of the United States Treasury.",
      createdBy: "admin1",
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
      createdAt: Date.now() - 10368000000,
      updatedAt: Date.now() - 86400000,
    },
  },
  {
    _id: "pos2",
    userId: "user1",
    poolId: "2",
    contractAddress: "0x4567890123456789012345678901234567890123",
    sharesOwned: "35000",
    assetsDeposited: "35000",
    depositTime: Date.now() - 15552000000,
    currentValue: "41850",
    expectedReturn: "43400",
    createdAt: Date.now() - 15552000000,
    updatedAt: Date.now() - 172800000,
    pool: {
      _id: "2",
      contractAddress: "0x4567890123456789012345678901234567890123",
      managerAddress: "0x5678901234567890123456789012345678901234",
      escrowAddress: "0x6789012345678901234567890123456789012345",
      name: "Corporate Bonds Series A",
      symbol: "CORP-A",
      asset: "USDC",
      instrumentType: InstrumentType.INTEREST_BEARING,
      status: PoolStatus.INVESTED,
      targetRaise: "15000000",
      totalRaised: "15000000",
      actualInvested: "14250000",
      couponRates: [400, 400, 400, 400],
      couponDates: [
        Date.now() + 7776000000,
        Date.now() + 15552000000,
        Date.now() + 23328000000,
        Date.now() + 31104000000,
      ],
      epochEndTime: Date.now() - 18144000000,
      maturityDate: Date.now() + 15552000000,
      issuer: "Fortune 500 Corporation",
      riskLevel: RiskLevel.MEDIUM,
      minInvestment: "5000",
      description:
        "24-month fixed-rate corporate bond from a leading technology company with quarterly coupon payments.",
      createdBy: "admin1",
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
      createdAt: Date.now() - 20736000000,
      updatedAt: Date.now() - 172800000,
    },
  },
  {
    _id: "pos3",
    userId: "user1",
    poolId: "3",
    contractAddress: "0x7890123456789012345678901234567890123456",
    sharesOwned: "15000",
    assetsDeposited: "15000",
    depositTime: Date.now() - 23328000000,
    currentValue: "18750",
    expectedReturn: "18750",
    createdAt: Date.now() - 23328000000,
    updatedAt: Date.now() - 43200000,
    pool: {
      _id: "3",
      contractAddress: "0x7890123456789012345678901234567890123456",
      managerAddress: "0x8901234567890123456789012345678901234567",
      escrowAddress: "0x9012345678901234567890123456789012345678",
      name: "Municipal Bonds 2024",
      symbol: "MUNI-24",
      asset: "USDC",
      instrumentType: InstrumentType.INTEREST_BEARING,
      status: PoolStatus.MATURED,
      targetRaise: "8500000",
      totalRaised: "8500000",
      actualInvested: "8075000",
      couponRates: [350, 350],
      couponDates: [Date.now() - 7776000000, Date.now() - 86400000],
      epochEndTime: Date.now() - 25920000000,
      maturityDate: Date.now() - 86400000,
      issuer: "City Municipal Authority",
      riskLevel: RiskLevel.LOW,
      minInvestment: "2500",
      description:
        "18-month municipal bond supporting local infrastructure development with semi-annual coupon payments.",
      createdBy: "admin2",
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: false,
      createdAt: Date.now() - 28512000000,
      updatedAt: Date.now() - 86400000,
    },
  },
];

const mockCoupons: (CouponPayment & { poolName: string })[] = [
  {
    poolId: "2",
    userId: "user1",
    amount: "1400",
    couponDate: Date.now() - 604800000,
    claimed: false,
    poolName: "Corporate Bonds Series A",
  },
  {
    poolId: "2",
    userId: "user1",
    amount: "1400",
    couponDate: Date.now() - 8380800000,
    claimed: true,
    claimedAt: Date.now() - 8294400000,
    txHash: "0xabcd1234...",
    poolName: "Corporate Bonds Series A",
  },
  {
    poolId: "3",
    userId: "user1",
    amount: "525",
    couponDate: Date.now() - 15552000000,
    claimed: true,
    claimedAt: Date.now() - 15466000000,
    txHash: "0xefgh5678...",
    poolName: "Municipal Bonds 2024",
  },
];

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const totalInvested = parseFloat(mockPortfolioData.totalInvested);
  const currentValue = parseFloat(mockPortfolioData.currentValue);
  const totalReturns = currentValue - totalInvested;
  const returnsPercentage =
    totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const activePositions = mockPositions.filter(
    (p) =>
      p.pool.status === PoolStatus.FUNDING ||
      p.pool.status === PoolStatus.INVESTED
  );
  const maturedPositions = mockPositions.filter(
    (p) => p.pool.status === PoolStatus.MATURED
  );

  const portfolioByRisk = useMemo(() => {
    const riskDistribution = {
      [RiskLevel.LOW]: 0,
      [RiskLevel.MEDIUM]: 0,
      [RiskLevel.HIGH]: 0,
    };
    mockPositions.forEach((position) => {
      riskDistribution[position.pool.riskLevel] += parseFloat(
        position.currentValue
      );
    });
    return riskDistribution;
  }, []);

  const portfolioByType = useMemo(() => {
    const typeDistribution = {
      [InstrumentType.DISCOUNTED]: 0,
      [InstrumentType.INTEREST_BEARING]: 0,
    };
    mockPositions.forEach((position) => {
      typeDistribution[position.pool.instrumentType] += parseFloat(
        position.currentValue
      );
    });
    return typeDistribution;
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-400 mt-1">
            Track your investments and returns across all pools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Invested
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockPortfolioData.totalInvested)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Across {mockPositions.length} positions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Current Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockPortfolioData.currentValue)}
            </div>
            <p className={`text-xs text-green-400 mt-1 flex items-center`}>
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {formatPercentage(returnsPercentage)} total return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Pending Coupons
            </CardTitle>
            <Receipt className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockPortfolioData.pendingCoupons)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {mockCoupons.filter((c) => !c.claimed).length} available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Available to Withdraw
            </CardTitle>
            <Target className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(mockPortfolioData.availableForWithdrawal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              From {maturedPositions.length} matured pools
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-white/10">
          <TabsTrigger
            value="overview"
            className="text-slate-300 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="positions"
            className="text-slate-300 data-[state=active]:text-white"
          >
            Positions
          </TabsTrigger>
          <TabsTrigger
            value="coupons"
            className="text-slate-300 data-[state=active]:text-white"
          >
            Coupons
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="text-slate-300 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Portfolio Distribution by Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(portfolioByRisk).map(([risk, value]) => {
                  const percentage =
                    currentValue > 0 ? (value / currentValue) * 100 : 0;
                  return (
                    <div key={risk} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRiskLevelColor(risk as RiskLevel)}`}
                          >
                            {risk} Risk
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(value.toString())}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatPercentage(percentage)}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2 bg-slate-800"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Portfolio Distribution by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(portfolioByType).map(([type, value]) => {
                  const percentage =
                    currentValue > 0 ? (value / currentValue) * 100 : 0;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs text-slate-300 border-slate-600"
                          >
                            {getInstrumentTypeLabel(
                              Number(type) as InstrumentType
                            )}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(value.toString())}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatPercentage(percentage)}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2 bg-slate-800"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <div className="space-y-4">
            {mockPositions.map((position) => {
              const positionReturns =
                parseFloat(position.currentValue) -
                parseFloat(position.assetsDeposited);
              const positionReturnsPercentage =
                parseFloat(position.assetsDeposited) > 0
                  ? (positionReturns / parseFloat(position.assetsDeposited)) *
                    100
                  : 0;
              const daysInvested = Math.floor(
                (Date.now() - position.depositTime) / (1000 * 60 * 60 * 24)
              );
              const apy = calculateAPY(
                position.currentValue,
                position.assetsDeposited,
                daysInvested
              );

              return (
                <Card
                  key={position._id}
                  className="bg-slate-900/50 border-white/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">
                          {position.pool.name}
                        </h3>
                        <p className="text-slate-400">{position.pool.issuer}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPoolStatusColor(position.pool.status)}`}
                          >
                            {getPoolStatusLabel(position.pool.status)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRiskLevelColor(position.pool.riskLevel)}`}
                          >
                            {position.pool.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(position.currentValue)}
                        </p>
                        <p
                          className={`text-sm flex items-center justify-end ${
                            positionReturns >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {positionReturns >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {formatPercentage(
                            Math.abs(positionReturnsPercentage)
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Invested</span>
                        <p className="font-semibold text-white">
                          {formatCurrency(position.assetsDeposited)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Returns</span>
                        <p
                          className={`font-semibold ${
                            positionReturns >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(Math.abs(positionReturns).toString())}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">APY</span>
                        <p className="font-semibold text-blue-400">
                          {formatPercentage(apy)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Maturity</span>
                        <p className="font-semibold text-white">
                          {formatDate(position.pool.maturityDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-white/20 hover:border-white/40"
                      >
                        <Link href={`/pools/${position.pool._id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Pool
                        </Link>
                      </Button>
                      {position.pool.status === PoolStatus.MATURED && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <div className="space-y-4">
            {mockCoupons.map((coupon, index) => (
              <Card key={index} className="bg-slate-900/50 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          coupon.claimed
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {coupon.claimed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {coupon.poolName}
                        </p>
                        <p className="text-sm text-slate-400">
                          Due: {formatDate(coupon.couponDate)}
                        </p>
                        {coupon.claimed && coupon.claimedAt && (
                          <p className="text-xs text-green-400">
                            Claimed: {formatDate(coupon.claimedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(coupon.amount)}
                      </p>
                      {!coupon.claimed ? (
                        <Button
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                          Claim
                        </Button>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-500/20 text-green-300 border-green-500/30"
                        >
                          Claimed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Return</span>
                  <span className="font-semibold text-green-400">
                    {formatCurrency(totalReturns.toString())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Return Percentage</span>
                  <span className="font-semibold text-green-400">
                    {formatPercentage(returnsPercentage)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Positions</span>
                  <span className="font-semibold text-white">
                    {activePositions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Matured Positions</span>
                  <span className="font-semibold text-white">
                    {maturedPositions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pending Coupons</span>
                  <span className="font-semibold text-yellow-400">
                    {mockCoupons.filter((c) => !c.claimed).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    By Risk Level
                  </h4>
                  {Object.entries(portfolioByRisk).map(([risk, value]) => {
                    const percentage =
                      currentValue > 0 ? (value / currentValue) * 100 : 0;
                    return (
                      <div
                        key={risk}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-slate-400">{risk} Risk</span>
                        <span className="font-semibold text-white">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    By Instrument Type
                  </h4>
                  {Object.entries(portfolioByType).map(([type, value]) => {
                    const percentage =
                      currentValue > 0 ? (value / currentValue) * 100 : 0;
                    return (
                      <div
                        key={type}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-slate-400">
                          {getInstrumentTypeLabel(
                            Number(type) as InstrumentType
                          )}
                        </span>
                        <span className="font-semibold text-white">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
