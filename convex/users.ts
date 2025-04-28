import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createUser = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const newUserId = await ctx.db.insert('users', { name: args.name });
		return newUserId;
	}
});
