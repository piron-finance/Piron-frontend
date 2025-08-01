import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

const requireAdmin = async (ctx: QueryCtx | MutationCtx, clerkId: string) => {
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("clerkId"), clerkId))
    .first();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new ConvexError("Unauthorized: Admin access required");
  }

  return user;
};

export const createPool = mutation({
  args: {
    adminClerkId: v.string(),
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
    targetRaise: v.string(),
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
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const poolId = await ctx.db.insert("pools", {
      contractAddress: args.contractAddress,
      managerAddress: args.managerAddress,
      escrowAddress: args.escrowAddress,
      name: args.name,
      symbol: args.symbol,
      asset: args.asset,
      instrumentType: args.instrumentType,
      status: "FUNDING",
      targetRaise: args.targetRaise,
      totalRaised: "0",
      discountRate: args.discountRate,
      couponRates: args.couponRates,
      couponDates: args.couponDates,
      epochEndTime: args.epochEndTime,
      maturityDate: args.maturityDate,
      issuer: args.issuer,
      riskLevel: args.riskLevel,
      minInvestment: args.minInvestment,
      description: args.description,
      createdBy: admin._id,
      approvalStatus: "APPROVED",
      approvedBy: admin._id,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: "POOL_APPROVED",
      targetId: poolId,
      targetType: "POOL",
      details: {
        reason: "Pool created by admin",
        metadata: {
          poolName: args.name,
          contractAddress: args.contractAddress,
        },
      },
      createdAt: Date.now(),
    });

    return poolId;
  },
});

export const approvePool = mutation({
  args: {
    adminClerkId: v.string(),
    poolId: v.id("pools"),
    approved: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const pool = await ctx.db.get(args.poolId);
    if (!pool) {
      throw new ConvexError("Pool not found");
    }

    const newStatus = args.approved ? "APPROVED" : "REJECTED";

    await ctx.db.patch(args.poolId, {
      approvalStatus: newStatus,
      approvedBy: admin._id,
      rejectionReason: args.approved ? undefined : args.reason,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: args.approved ? "POOL_APPROVED" : "POOL_REJECTED",
      targetId: args.poolId,
      targetType: "POOL",
      details: {
        reason:
          args.reason || (args.approved ? "Pool approved" : "Pool rejected"),
        metadata: { poolName: pool.name },
      },
      createdAt: Date.now(),
    });

    const creator = await ctx.db.get(pool.createdBy);
    if (creator) {
      await ctx.db.insert("notifications", {
        userId: creator._id,
        type: args.approved ? "POOL_APPROVED" : "POOL_REJECTED",
        title: args.approved ? "Pool Approved" : "Pool Rejected",
        message: args.approved
          ? `Your pool "${pool.name}" has been approved and is now active.`
          : `Your pool "${pool.name}" has been rejected. Reason: ${args.reason}`,
        isRead: false,
        metadata: { poolId: args.poolId },
        createdAt: Date.now(),
      });
    }

    return args.poolId;
  },
});

export const updatePoolStatus = mutation({
  args: {
    adminClerkId: v.string(),
    poolId: v.id("pools"),
    newStatus: v.union(
      v.literal("FUNDING"),
      v.literal("PENDING_INVESTMENT"),
      v.literal("INVESTED"),
      v.literal("MATURED"),
      v.literal("EMERGENCY")
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const pool = await ctx.db.get(args.poolId);
    if (!pool) {
      throw new ConvexError("Pool not found");
    }

    const oldStatus = pool.status;

    await ctx.db.patch(args.poolId, {
      status: args.newStatus,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: "POOL_STATUS_UPDATED",
      targetId: args.poolId,
      targetType: "POOL",
      details: {
        oldValue: oldStatus,
        newValue: args.newStatus,
        reason:
          args.reason ||
          `Status changed from ${oldStatus} to ${args.newStatus}`,
      },
      createdAt: Date.now(),
    });

    return args.poolId;
  },
});

export const confirmInvestment = mutation({
  args: {
    adminClerkId: v.string(),
    poolId: v.id("pools"),
    actualInvested: v.string(),
    proofHash: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const pool = await ctx.db.get(args.poolId);
    if (!pool) {
      throw new ConvexError("Pool not found");
    }

    await ctx.db.patch(args.poolId, {
      actualInvested: args.actualInvested,
      status: "INVESTED",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: "INVESTMENT_CONFIRMED",
      targetId: args.poolId,
      targetType: "POOL",
      details: {
        reason: "Investment confirmed",
        metadata: {
          actualInvested: args.actualInvested,
          proofHash: args.proofHash,
        },
      },
      createdAt: Date.now(),
    });

    return args.poolId;
  },
});

export const getDashboardStats = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminClerkId);

    const [totalPools, activePools, totalUsers, pendingApprovals] =
      await Promise.all([
        ctx.db
          .query("pools")
          .collect()
          .then((pools) => pools.length),
        ctx.db
          .query("pools")
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect()
          .then((pools) => pools.length),
        ctx.db
          .query("users")
          .collect()
          .then((users) => users.length),
        ctx.db
          .query("pools")
          .filter((q) => q.eq(q.field("approvalStatus"), "PENDING"))
          .collect()
          .then((pools) => pools.length),
      ]);

    const poolsByStatus = await ctx.db.query("pools").collect();
    const statusCounts = poolsByStatus.reduce(
      (acc, pool) => {
        acc[pool.status] = (acc[pool.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalValueLocked = poolsByStatus.reduce((sum, pool) => {
      return sum + parseFloat(pool.totalRaised || "0");
    }, 0);

    return {
      totalPools,
      activePools,
      totalUsers,
      pendingApprovals,
      statusCounts,
      totalValueLocked: totalValueLocked.toString(),
    };
  },
});

export const getPendingApprovals = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminClerkId);

    const pendingPools = await ctx.db
      .query("pools")
      .filter((q) => q.eq(q.field("approvalStatus"), "PENDING"))
      .collect();

    const poolsWithCreators = await Promise.all(
      pendingPools.map(async (pool) => {
        const creator = await ctx.db.get(pool.createdBy);
        return {
          ...pool,
          creator: creator
            ? { name: creator.name, email: creator.email }
            : null,
        };
      })
    );

    return poolsWithCreators;
  },
});

export const getAdminActions = query({
  args: {
    adminClerkId: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminClerkId);

    const actions = await ctx.db.query("adminActions").order("desc").collect();

    const actionsWithAdmins = await Promise.all(
      actions
        .slice(args.offset || 0, (args.offset || 0) + (args.limit || 50))
        .map(async (action) => {
          const admin = await ctx.db.get(action.adminId);
          return {
            ...action,
            admin: admin ? { name: admin.name, email: admin.email } : null,
          };
        })
    );

    return actionsWithAdmins;
  },
});

export const getAllPoolsForAdmin = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminClerkId);

    const pools = await ctx.db.query("pools").collect();

    const poolsWithCreators = await Promise.all(
      pools.map(async (pool) => {
        const creator = await ctx.db.get(pool.createdBy);
        const approver = pool.approvedBy
          ? await ctx.db.get(pool.approvedBy)
          : null;

        return {
          ...pool,
          creator: creator
            ? { name: creator.name, email: creator.email }
            : null,
          approver: approver
            ? { name: approver.name, email: approver.email }
            : null,
        };
      })
    );

    return poolsWithCreators;
  },
});

export const updateSystemSetting = mutation({
  args: {
    adminClerkId: v.string(),
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    if (admin.role !== "SUPER_ADMIN") {
      throw new ConvexError("Unauthorized: Super admin access required");
    }

    const existing = await ctx.db
      .query("systemSettings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        description: args.description,
        updatedBy: admin._id,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("systemSettings", {
        key: args.key,
        value: args.value,
        description: args.description,
        updatedBy: admin._id,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getSystemSettings = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    if (admin.role !== "SUPER_ADMIN") {
      throw new ConvexError("Unauthorized: Super admin access required");
    }

    return await ctx.db.query("systemSettings").collect();
  },
});

export const emergencyAction = mutation({
  args: {
    adminClerkId: v.string(),
    poolId: v.id("pools"),
    action: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const pool = await ctx.db.get(args.poolId);
    if (!pool) {
      throw new ConvexError("Pool not found");
    }

    await ctx.db.patch(args.poolId, {
      status: "EMERGENCY",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: "EMERGENCY_ACTION",
      targetId: args.poolId,
      targetType: "POOL",
      details: {
        reason: args.reason,
        metadata: { emergencyAction: args.action },
      },
      createdAt: Date.now(),
    });

    return args.poolId;
  },
});

export const togglePoolActive = mutation({
  args: {
    adminClerkId: v.string(),
    poolId: v.id("pools"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.adminClerkId);

    const pool = await ctx.db.get(args.poolId);
    if (!pool) {
      throw new ConvexError("Pool not found");
    }

    const newActiveStatus = !pool.isActive;

    await ctx.db.patch(args.poolId, {
      isActive: newActiveStatus,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: newActiveStatus ? "POOL_ACTIVATED" : "POOL_PAUSED",
      targetId: args.poolId,
      targetType: "POOL",
      details: {
        reason:
          args.reason || `Pool ${newActiveStatus ? "activated" : "paused"}`,
        metadata: { poolName: pool.name, newStatus: newActiveStatus },
      },
      createdAt: Date.now(),
    });

    return args.poolId;
  },
});
