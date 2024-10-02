import { mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { getUserByClerkId } from './_utils';

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // get Clerk identity
    const identity = await ctx.auth.getUserIdentity();

    // not logged in
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    // prevent sending request to yourself
    if (args.email === identity.email) {
      throw new ConvexError("Can't send a request to yourself");
    }

    // get current user from convex
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get receiver
    const receiver = await ctx.db
      .query('users')
      .withIndex('by_email' as never, (q) =>
        q.eq('email' as never, args.email as never)
      )
      .unique();
    if (!receiver) {
      throw new ConvexError('Receiver could not be found');
    }

    // check if request already sent
    const requestAlreadySent = await ctx.db
      .query('requests')
      .withIndex('by_receiver_sender' as never, (q) =>
        q
          .eq('receiver' as never, receiver._id as never)
          .eq('sender' as never, currentUser._id as never)
      );
    if (requestAlreadySent) {
      throw new ConvexError('Request already sent');
    }

    // check if request already received
    const requestAlreadyReceived = await ctx.db
      .query('requests')
      .withIndex('by_receiver_sender' as never, (q) =>
        q
          .eq('receiver' as never, currentUser._id as never)
          .eq('sender' as never, receiver._id as never)
      );
    if (requestAlreadyReceived) {
      throw new ConvexError('Request already received');
    }

    // create friend request
    const request = await ctx.db.insert('requests', {
      sender: currentUser._id,
      receiver: receiver._id
    })

    return request;
  },
});
