import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	rooms: defineTable({
		rules: v.object({
			murderes: v.number(),
			angels: v.number()
		}),
		playing: v.boolean(),
		nights: v.array(
			v.object({
				murdered: v.array(v.id('players')),
				saved: v.array(v.id('players')),
				baned: v.id('players')
			})
		)
	}),
	users: defineTable({
		name: v.string()
	}),
	players: defineTable({
		user_id: v.id('users'),
		room_id: v.id('rooms'),
		type: v.union(
			v.literal('unknown'),
			v.literal('murderer'),
			v.literal('angel'),
			v.literal('narrator'),
			v.literal('citizen')
		),
		alive: v.boolean()
	})
});
