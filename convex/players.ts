import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) return false;
    if (user.email === null) return false;
    const room = await ctx.db.get(args.room_id);
    if (!room) return false;
    if (room.playing) return false;
    const playerExists = await ctx.db
      .query("players")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), user.email),
          q.eq(q.field("room_id"), args.room_id)
        )
      )
      .first();
    if (playerExists) return false;
    const newPlayerId = await ctx.db.insert("players", {
      room_id: args.room_id,
      name: user.givenName ?? "Unknown",
      email: user.email ?? "Unknown",
      type: "unknown",
      alive: true,
    });
    return newPlayerId;
  },
});

export const setType = mutation({
  args: {
    player_id: v.id("players"),
    type: v.union(
      v.literal("murderer"),
      v.literal("angel"),
      v.literal("narrator"),
      v.literal("citizen")
    ),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player || player.type != "unknown") return false;
    await ctx.db.patch(args.player_id, { type: args.type });
    return true;
  },
});

export const murder = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player || !player.alive) return false;
    if (player.type === "narrator" || player.type === "murderer") return false;
    await ctx.db.patch(args.player_id, { alive: false });
    return true;
  },
});

export const ban = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player || !player.alive) return false;
    if (player.type === "narrator") return false;
    await ctx.db.patch(args.player_id, { alive: false });
    return true;
  },
});
