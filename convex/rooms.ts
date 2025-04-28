import { mutation } from './_generated/server';
// import { v } from 'convex/values';

export const createRoom = mutation({
	handler: async (ctx) => {
		const newRoomId = await ctx.db.insert('rooms', {
			rules: {
				murderes: 1,
				angels: 1
			},
			playing: false,
			nights: []
		});
		return newRoomId;
	}
});
