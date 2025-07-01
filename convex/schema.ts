import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    walletAddress: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_wallet", ["walletAddress"]),

  pools: defineTable({
    contractAddress: v.string(),
    managerAddress: v.string(),
    escrowAddress: v.string(),
    name: v.string(),
    symbol: v.optional(v.string()),
    asset: v.optional(v.string()),
    instrumentType: v.union(
      v.literal("DISCOUNTED"),
      v.literal("INTEREST_BEARING")
    ),
    status: v.union(
      v.literal("FUNDING"),
      v.literal("PENDING_INVESTMENT"),
      v.literal("INVESTED"),
      v.literal("MATURED"),
      v.literal("EMERGENCY")
    ),

    targetRaise: v.string(),
    totalRaised: v.string(),
    actualInvested: v.optional(v.string()),
    discountRate: v.optional(v.number()),
    couponRates: v.optional(v.array(v.number())),
    epochEndTime: v.number(),
    maturityDate: v.number(),

    issuer: v.string(),
    riskLevel: v.union(
      v.literal("Low"),
      v.literal("Medium"),
      v.literal("High")
    ),
    minInvestment: v.string(),
    description: v.optional(v.string()),

    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_contract", ["contractAddress"])
    .index("by_status", ["status"])
    .index("by_instrument_type", ["instrumentType"])
    .index("by_maturity", ["maturityDate"]),

  userPositions: defineTable({
    userId: v.id("users"),
    poolId: v.id("pools"),
    contractAddress: v.string(),

    sharesOwned: v.string(),
    assetsDeposited: v.string(),
    depositTime: v.number(),

    currentValue: v.string(),
    expectedReturn: v.string(),
    discountEarned: v.optional(v.string()),

    lastTransactionHash: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_pool", ["poolId"])
    .index("by_user_pool", ["userId", "poolId"]),

  transactions: defineTable({
    userId: v.id("users"),
    poolId: v.id("pools"),

    type: v.union(
      v.literal("DEPOSIT"),
      v.literal("WITHDRAW"),
      v.literal("EMERGENCY_WITHDRAW")
    ),
    amount: v.string(),
    shares: v.string(),
    txHash: v.string(),
    blockNumber: v.number(),

    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("FAILED")
    ),

    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_pool", ["poolId"])
    .index("by_tx_hash", ["txHash"]),
});
