import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserByClerkId } from './_utils';
import { Id } from './_generated/dataModel';

export type Conversation = {
  _id: Id<'conversations'>;
  name?: string;
  isGroup?: boolean;
  otherMembers:
    | ({
        _id: Id<'users'>;
        _creationTime: number;
        username: string;
        imageUrl: string;
        clerkId: string;
        email: string;
      } | null)[]
    | null[];
  lastMessage: {
    sender: string;
    content: string[];
  } | null;
};

export const get = query({
  args: { id: v.id('conversations') },
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

    // get conversation
    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    // get membership
    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q.eq('memberId', currentUser._id).eq('conversationId', conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    // get all conversation members
    const allConversationMemberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      return {
        ...conversation,
        otherMembers: [
          {
            ...otherMemberDetails,
            lastSeenMessageId: otherMembership.lastSeenMessage,
          },
        ],
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);

            if (!member) {
              throw new ConvexError('Member could not be found');
            }

            return {
              _id: member._id,
              username: member.username,
              lastSeenMessageId: membership.lastSeenMessage,
            };
          })
      );

      return { ...conversation, otherMembers };
    }
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id('conversations'),
    messageId: v.id('messages'),
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
      )
      .unique();
    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    // get last message
    const lastMessage = await ctx.db.get(args.messageId);

    // mark last message as read
    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    });
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id('users')),
    name: v.string(),
  },
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

    // insert group conversation
    const conversationId = await ctx.db.insert('conversations', {
      isGroup: true,
      name: args.name,
    });

    // add all members to group
    await Promise.all(
      [...args.members, currentUser._id].map(
        async (memberId) =>
          await ctx.db.insert('conversationMembers', {
            memberId,
            conversationId,
          })
      )
    );
  },
});

export const deleteGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    // get Clerk identity + authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }
    // get current user from convex
    const curentUser = await getUserByClerkId(ctx, identity.subject);
    if (!curentUser) {
      throw new ConvexError('User not found');
    }

    // get conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    // get memberships
    const memberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .collect();

    // get messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .collect();

    // WIPE DATA
    // Delete conversation
    await ctx.db.delete(args.conversationId);
    // Delete conversation memberships
    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id);
      })
    );
    // Delete conversation messages
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});

export const leaveGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    // get Clerk identity + authorize
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }
    // get current user from convex
    const curentUser = await getUserByClerkId(ctx, identity.subject);
    if (!curentUser) {
      throw new ConvexError('User not found');
    }

    // get conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    // get membership
    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q
          .eq('memberId', curentUser._id)
          .eq('conversationId', args.conversationId)
      )
      .unique();
    if (!membership) {
      throw new ConvexError('You are not a member of this group');
    }

    // Delete conversation memberships - so leave group
    await ctx.db.delete(membership._id);

    // get memberships
    const memberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .collect();

    // WIPE group if no members
    if (!memberships || memberships.length <= 0) {
      // WIPE DATA
      // Delete conversation
      await ctx.db.delete(args.conversationId);
      // Get and Delete conversation messages
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_conversationId', (q) =>
          q.eq('conversationId', args.conversationId)
        )
        .collect();
      await Promise.all(
        messages.map(async (message) => {
          await ctx.db.delete(message._id);
        })
      );
    }
  },
});
