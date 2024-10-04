import { ConvexError } from 'convex/values';
import { getUserByClerkId } from './_utils';
import { query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    // get user / check authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // get current user
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get requests
    const requests = await ctx.db
      .query('requests')
      .withIndex('by_receiver', (q) => q.eq('receiver', currentUser._id))
      .collect();

    // get senders details
    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.sender);

        if (!sender) {
          throw new ConvexError(`Request sender could not be found`);
        }

        return {
          sender,
          request,
        };
      })
    );

    return requestsWithSender;
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    // get user / check authorization
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // get current user
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get requests
    const requests = await ctx.db
      .query('requests')
      .withIndex('by_receiver', (q) => q.eq('receiver', currentUser._id))
      .collect();

    return requests.length;
  },
});
