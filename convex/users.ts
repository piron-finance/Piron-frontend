import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    walletAddress: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("clerkId"), args.clerkId),
          q.eq(q.field("email"), args.email)
        )
      )
      .collect();

    if (existingUsers.length > 0) {
      const userByClerkId = existingUsers.find(
        (user) => user.clerkId === args.clerkId
      );
      if (userByClerkId) {
        return userByClerkId._id;
      }

      const userByEmail = existingUsers.find(
        (user) => user.email === args.email
      );
      if (userByEmail) {
        await ctx.db.patch(userByEmail._id, {
          clerkId: args.clerkId,
          updatedAt: args.updatedAt,
        });
        return userByEmail._id;
      }
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      image: args.image,
      walletAddress: args.walletAddress,
      role: "USER",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    return user;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("walletAddress"), args.walletAddress))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

export const updateWallet = mutation({
  args: {
    clerkId: v.string(),
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const existingWalletUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("walletAddress"), args.walletAddress))
      .first();

    if (existingWalletUser && existingWalletUser._id !== user._id) {
      throw new ConvexError("Wallet address already linked to another account");
    }

    await ctx.db.patch(user._id, {
      walletAddress: args.walletAddress,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

export const removeWallet = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      walletAddress: undefined,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);

    return { success: true };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateRole = mutation({
  args: {
    adminClerkId: v.string(),
    targetClerkId: v.string(),
    newRole: v.union(
      v.literal("USER"),
      v.literal("ADMIN"),
      v.literal("SUPER_ADMIN")
    ),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.adminClerkId))
      .first();

    if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
      throw new ConvexError("Unauthorized: Admin access required");
    }

    if (args.newRole === "SUPER_ADMIN" && admin.role !== "SUPER_ADMIN") {
      throw new ConvexError("Unauthorized: Super admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.targetClerkId))
      .first();

    if (!targetUser) {
      throw new ConvexError("Target user not found");
    }

    const oldRole = targetUser.role;

    await ctx.db.patch(targetUser._id, {
      role: args.newRole,
      permissions: args.permissions,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActions", {
      adminId: admin._id,
      action: "USER_ROLE_CHANGED",
      targetId: targetUser._id,
      targetType: "USER",
      details: {
        oldValue: oldRole,
        newValue: args.newRole,
        reason: `Role changed from ${oldRole} to ${args.newRole}`,
      },
      createdAt: Date.now(),
    });

    return targetUser._id;
  },
});

export const checkAdminAccess = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    return {
      isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
      isSuperAdmin: user?.role === "SUPER_ADMIN",
      role: user?.role || "USER",
      permissions: user?.permissions || [],
    };
  },
});

export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("role"), "ADMIN"),
          q.eq(q.field("role"), "SUPER_ADMIN")
        )
      )
      .collect();
  },
});
