import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    walletAddress: v.optional(v.string()),
    role: v.union(
      v.literal("USER"),
      v.literal("ADMIN"),
      v.literal("SUPER_ADMIN")
    ),
    permissions: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_wallet", ["walletAddress"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"]),

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
    couponDates: v.optional(v.array(v.number())),
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

    createdBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    approvalStatus: v.union(
      v.literal("PENDING"),
      v.literal("APPROVED"),
      v.literal("REJECTED")
    ),
    rejectionReason: v.optional(v.string()),

    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_contract", ["contractAddress"])
    .index("by_status", ["status"])
    .index("by_instrument_type", ["instrumentType"])
    .index("by_maturity", ["maturityDate"])
    .index("by_created_by", ["createdBy"])
    .index("by_approval_status", ["approvalStatus"]),

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
      v.literal("EMERGENCY_WITHDRAW"),
      v.literal("POOL_CREATION"),
      v.literal("INVESTMENT_PROCESSED"),
      v.literal("COUPON_PAYMENT")
    ),
    amount: v.string(),
    shares: v.optional(v.string()),
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
    .index("by_tx_hash", ["txHash"])
    .index("by_type", ["type"]),

  adminActions: defineTable({
    adminId: v.id("users"),
    action: v.union(
      v.literal("POOL_APPROVED"),
      v.literal("POOL_REJECTED"),
      v.literal("USER_ROLE_CHANGED"),
      v.literal("POOL_STATUS_UPDATED"),
      v.literal("EMERGENCY_ACTION"),
      v.literal("INVESTMENT_CONFIRMED"),
      v.literal("POOL_ACTIVATED"),
      v.literal("POOL_PAUSED")
    ),
    targetId: v.optional(v.string()),
    targetType: v.union(
      v.literal("POOL"),
      v.literal("USER"),
      v.literal("TRANSACTION")
    ),
    details: v.object({
      oldValue: v.optional(v.string()),
      newValue: v.optional(v.string()),
      reason: v.optional(v.string()),
      metadata: v.optional(v.any()),
    }),
    createdAt: v.number(),
  })
    .index("by_admin", ["adminId"])
    .index("by_action", ["action"])
    .index("by_target", ["targetType", "targetId"]),

  systemSettings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updatedBy: v.id("users"),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("POOL_APPROVED"),
      v.literal("POOL_REJECTED"),
      v.literal("INVESTMENT_MATURED"),
      v.literal("COUPON_RECEIVED"),
      v.literal("EMERGENCY_ALERT"),
      v.literal("SYSTEM_ANNOUNCEMENT")
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_read_status", ["isRead"]),
});
