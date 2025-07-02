import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getUserNotifications = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();

    const start = args.offset || 0;
    const end = start + (args.limit || 50);

    return notifications.slice(start, end);
  },
});

export const getUnreadCount = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      return 0;
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("isRead"), false))
      )
      .collect();

    return unreadNotifications.length;
  },
});

export const markAsRead = mutation({
  args: {
    clerkId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new ConvexError("Notification not found");
    }

    if (notification.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return args.notificationId;
  },
});

export const markAllAsRead = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("isRead"), false))
      )
      .collect();

    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});

export const createNotification = mutation({
  args: {
    clerkId: v.string(),
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
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("notifications", {
      userId: user._id,
      type: args.type,
      title: args.title,
      message: args.message,
      isRead: false,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export const deleteNotification = mutation({
  args: {
    clerkId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new ConvexError("Notification not found");
    }

    if (notification.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(args.notificationId);
    return args.notificationId;
  },
});
