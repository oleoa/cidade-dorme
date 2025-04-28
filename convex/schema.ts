import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    rules: v.object({
      murderers: v.number(),
      angels: v.number(),
    }),
    playing: v.boolean(),
    nights: v.array(
      v.object({
        murdered: v.array(v.id("players")),
        saved: v.array(v.id("players")),
        baned: v.union(v.id("players"), v.null()),
      })
    ),
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
  }),
});
