import { ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx, query } from './_generated/server';
import { getUserByClerkId } from './_utils';
import { Id } from './_generated/dataModel';
import { type Conversation } from './conversation';

export const get = query({
  args: {},
  handler: async (ctx) => {
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

    // get conversation memberships
    const conversationMemberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId', (q) => q.eq('memberId', currentUser._id))
      .collect();

    // get conversations from memberships
    const conversations = await Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);

        if (!conversation) {
          throw new ConvexError('Conversation could not be found');
        }

        return conversation;
      })
    );

    // get details for conversations
    const conversationsWithDetails: Conversation[] = await Promise.all(
      conversations.map(async (conversation) => {
        const allConversationMemberships = await ctx.db
          .query('conversationMembers')
          .withIndex('by_conversationId', (q) =>
            q.eq('conversationId', conversation?._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conversation.lastMessageId,
        });

        if (conversation?.isGroup) {
          return {
            ...conversation,
            otherMembers: [null],
            lastMessage,
          };
        } else {
          const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
          )[0];

          const otherMember = await ctx.db.get(otherMembership.memberId);

          return {
            ...conversation,
            otherMembers: [otherMember],
            lastMessage,
          };
        }
      })
    );

    return conversationsWithDetails;
  },
});

// last message details helper
const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<'messages'> | undefined;
}) => {
  if (!id) return null;

  const message = await ctx.db.get(id);

  if (!message) return null;

  const sender = await ctx.db.get(message.senderId);

  if (!sender) return null;

  const content = getMessageContent(message.type, message.content);

  return {
    content,
    sender: sender.username,
  };
};

// message content helper
const getMessageContent = (type: string, content: string[]) => {
  switch (type) {
    case 'text':
      return content;
    default:
      return content;
  }
};
