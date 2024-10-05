import { ConvexError } from 'convex/values';
import { query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    // get Clerk identity + authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // get current user from convex
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get all friendships
    const friendships1 = await ctx.db
      .query('friends')
      .withIndex('by_user1', (q) => q.eq('user1', currentUser._id))
      .collect();
    const friendships2 = await ctx.db
      .query('friends')
      .withIndex('by_user2', (q) => q.eq('user2', currentUser._id))
      .collect();
    const friendships = [...friendships1, ...friendships2];

    // get all friends
    let friends = await Promise.all(
      friendships?.map(async (friendship) => {
        const friend = await ctx.db.get(
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1
        );

        if (!friend) {
          return null;
        }

        return friend;
      })
    );
    friends = friends.filter(f => f); // remove nulls

    return friends;
  },
});
