import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createPlayer = mutation({
	args: {
		user_id: v.id('users'),
		room_id: v.id('rooms')
	},
	handler: async (ctx, args) => {
		const newUserId = await ctx.db.insert('players', {
			user_id: args.user_id,
			room_id: args.room_id,
			type: 'unknown',
			alive: true
		});
		return newUserId;
	}
});

export const setPlayerType = mutation({
	args: {
		player_id: v.id('players'),
		type: v.union(
			v.literal('murderer'),
			v.literal('angel'),
			v.literal('narrator'),
			v.literal('citizen')
		)
	},
	handler: async (ctx, args) => {
		const player = await ctx.db.get(args.player_id);
		if (!player || player.type != 'unknown') return false;
		await ctx.db.patch(args.player_id, { type: args.type });
		return true;
	}
});

export const murderPlayer = mutation({
	args: {
		player_id: v.id('players')
	},
	handler: async (ctx, args) => {
		const player = await ctx.db.get(args.player_id);
		if (!player || !player.alive) return false;
		if (player.type === 'narrator' || player.type === 'murderer') return false;
		await ctx.db.patch(args.player_id, { alive: false });
		return true;
	}
});

export const banPlayer = mutation({
	args: {
		player_id: v.id('players')
	},
	handler: async (ctx, args) => {
		const player = await ctx.db.get(args.player_id);
		if (!player || !player.alive) return false;
		if (player.type === 'narrator') return false;
		await ctx.db.patch(args.player_id, { alive: false });
		return true;
	}
});
