import { mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { getUserByClerkId } from './_utils';


export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // get Clerk identity + authorize
    const identity = await ctx.auth.getUserIdentity();
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
      )
      .unique();
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
      )
      .unique();
    if (requestAlreadyReceived) {
      throw new ConvexError('This user already sent you a request');
    }

    // get friendships and check if you are already friends
    const friends1 = await ctx.db
      .query('friends')
      .withIndex('by_user1', (q) => q.eq('user1', currentUser._id))
      .collect();
    const friends2 = await ctx.db
      .query('friends')
      .withIndex('by_user2', (q) => q.eq('user2', currentUser._id))
      .collect();
    if (
      friends1.some((friend) => friend.user2 === receiver._id) ||
      friends2.some((friend) => friend.user1 === receiver._id)
    ) {
      throw new ConvexError('You are already friends with this user');
    }

    // create friend request
    const request = await ctx.db.insert('requests', {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const accept = mutation({
  args: {
    id: v.id('requests'),
  },
  handler: async (ctx, args) => {
    // get Clerk identity and authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // get current user from convex
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get request
    const request = await ctx.db.get(args.id);
    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError('There was an error accepting this request');
    }

    // add conversation between friends(private conversation)
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    // create friendship
    await ctx.db.insert("friends", {
      user1: currentUser._id,
      user2: request.sender,
      conversationId,
    });

    // add members to conversation
    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
    });
    await ctx.db.insert("conversationMembers", {
      memberId: request.sender,
      conversationId,
    });

    // delete request
    await ctx.db.delete(request._id);
  },
});

export const deny = mutation({
  args: {
    id: v.id('requests'),
  },
  handler: async (ctx, args) => {
    // get Clerk identity and authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // get current user from convex
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get request
    const request = await ctx.db.get(args.id);
    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError('There was an error denying this request');
    }

    // delete request
    await ctx.db.delete(request._id);
  },
});
