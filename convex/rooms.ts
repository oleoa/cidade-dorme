import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { shuffle } from "../src/lib/utils";

export const terminate = mutation({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.room_id))
      .collect();
    for (const player of players) {
      await ctx.db.delete(player._id);
    }
    await ctx.db.delete(args.room_id);
    return true;
  },
});

export const create = mutation({
  handler: async (ctx) => {
    const newRoomId = await ctx.db.insert("rooms", {
      rules: {
        murderers: 1,
        angels: 1,
      },
      playing: false,
    });
    return newRoomId;
  },
});

export const get = query({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.room_id);
  },
});

export const getPlayers = query({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.room_id))
      .collect();
  },
});

export const updateRules = mutation({
  args: {
    room_id: v.id("rooms"),
    rules: v.object({
      murderers: v.number(),
      angels: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.room_id, { rules: args.rules });
    return true;
  },
});

export const start = mutation({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) return false;
    if (room.playing) return false;
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.room_id))
      .collect();
    if (players.length < 5) return false;

    const narrator = 1;
    const murderers = Number(room.rules.murderers);
    const angels = Number(room.rules.angels);
    const citizens = players.length - murderers - angels - narrator;
    if (citizens < 0) return false;

    const types = [
      ...Array(narrator).fill("narrator"),
      ...Array(murderers).fill("murderer"),
      ...Array(angels).fill("angel"),
      ...Array(citizens).fill("citizen"),
    ];

    // Shuffle the types array
    const shuffledTypes = shuffle(types);

    // Assign types to players and set all as alive
    for (let i = 0; i < players.length; i++) {
      await ctx.db.patch(players[i]._id, {
        type: shuffledTypes[i],
        alive: true,
      });
    }

    await ctx.db.patch(args.room_id, { playing: true });
    return true;
  },
});
