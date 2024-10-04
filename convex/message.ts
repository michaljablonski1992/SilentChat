import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const create = mutation({
  args: {
    conversationId: v.id('conversations'),
    type: v.string(),
    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // get Clerk identity + authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    // get current user from convex
    const currentUser = await getUserByClerkId(ctx, identity.subject);
    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // get membership
    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q
          .eq('memberId', currentUser._id)
          .eq('conversationId', args.conversationId)
      );
    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    // insert message
    const message = await ctx.db.insert('messages', {
      senderId: currentUser._id,
      ...args,
    });

    // update last message id for conversation
    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});
