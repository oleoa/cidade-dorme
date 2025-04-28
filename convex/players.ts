import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFaleExamples = mutation({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const players = [
      {
        name: "Vinicius",
        alive: true,
        type: "unknown" as const,
        email: "vinicius@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Dárcio",
        alive: true,
        type: "unknown" as const,
        email: "darcio@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "João",
        alive: true,
        type: "unknown" as const,
        email: "joao@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Pedro",
        alive: true,
        type: "unknown" as const,
        email: "pedro@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Isabela",
        alive: true,
        type: "unknown" as const,
        email: "isabela@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Ana",
        alive: true,
        type: "unknown" as const,
        email: "ana@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Rafael",
        alive: true,
        type: "unknown" as const,
        email: "rafael@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Gabriel",
        alive: true,
        type: "unknown" as const,
        email: "gabriel@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Bruno",
        alive: true,
        type: "unknown" as const,
        email: "bruno@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
      {
        name: "Guilherme",
        alive: true,
        type: "unknown" as const,
        email: "guilherme@gmail.com",
        room_id: args.room_id,
        death_reason: null,
      },
    ];
    for (const player of players) {
      await ctx.db.insert("players", player);
    }
  },
});

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
      death_reason: null,
    });
    return newPlayerId;
  },
});

export const getMyself = query({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) return false;
    if (user.email === null) return false;
    const player = await ctx.db
      .query("players")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), user.email),
          q.eq(q.field("room_id"), args.room_id)
        )
      )
      .first();
    return player;
  },
});

export const revive = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player) return { success: false, message: "Player not found" };
    if (player.alive)
      return { success: false, message: "Player already alive" };
    const room = await ctx.db.get(player.room_id);
    if (!room) return { success: false, message: "Room not found" };
    if (!room.playing)
      return { success: false, message: "Game " + room.status };
    await ctx.db.patch(args.player_id, { alive: true, death_reason: null });
    return { success: true, message: "Player revived" };
  },
});

export const getPlayers = query({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .filter((q) => q.and(q.eq(q.field("room_id"), args.room_id)))
      .collect();
    return players;
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
    if (!player) return { success: false, message: "Player not found" };
    if (!player.alive)
      return { success: false, message: "Player already dead" };
    if (player.type === "murderer")
      return {
        success: false,
        message: "Murderer cannot be murdered",
      };
    if (player.type === "narrator")
      return {
        success: false,
        message: "Narrator cannot be murdered",
      };
    const room = await ctx.db.get(player.room_id);
    if (!room) return { success: false, message: "Room not found" };
    if (!room.playing) return { success: false, message: "Game paused" };
    await ctx.db.patch(args.player_id, {
      alive: false,
      death_reason: "murdered",
    });
    return { success: true, message: "Player murdered" };
  },
});

export const ban = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player) return { success: false, message: "Player not found" };
    if (!player.alive)
      return { success: false, message: "Player already dead" };
    if (player.type === "narrator")
      return { success: false, message: "Narrator cannot be banned" };
    const room = await ctx.db.get(player.room_id);
    if (!room) return { success: false, message: "Room not found" };
    if (!room.playing) return { success: false, message: "Game paused" };
    await ctx.db.patch(args.player_id, {
      alive: false,
      death_reason: "banned",
    });
    return { success: true, message: "Player banned" };
  },
});

export const leave = mutation({
  args: {
    player_id: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.player_id);
    if (!player) return false;
    if (player.type === "narrator") return false;
    if (player.type === "murderer") return false;
    if (player.type === "angel") return false;
    await ctx.db.delete(args.player_id);
    return true;
  },
});

export const setNarrator = mutation({
  args: {
    narrator: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.narrator);
    if (!player) return false;
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), player.room_id))
      .collect();
    for (const p of players) {
      await ctx.db.patch(p._id, { type: "unknown" });
    }
    await ctx.db.patch(args.narrator, { type: "narrator" });
    return player.name;
  },
});

export const unsetNarrator = mutation({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.room_id))
      .collect();
    for (const p of players) {
      await ctx.db.patch(p._id, { type: "unknown" });
    }
    return true;
  },
});
