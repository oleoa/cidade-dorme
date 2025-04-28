import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    rules: v.object({
      murderers: v.number(),
      angels: v.number(),
    }),
    playing: v.boolean(),
  }),

  players: defineTable({
    name: v.string(),
    email: v.string(),
    room_id: v.id("rooms"),
    type: v.union(
      v.literal("unknown"),
      v.literal("murderer"),
      v.literal("angel"),
      v.literal("narrator"),
      v.literal("citizen")
    ),
    alive: v.boolean(),
    death_reason: v.union(v.string(), v.null()),
  }),
});
