'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React, { useEffect } from 'react';
import Message from './Message';
import { useMutationState } from '@/hooks/useMutationState';
import { useConversation } from '@/hooks/useConversation';
import TooltipWrapper from '@/components/shared/TooltipWrapper';

type Props = {
  members: {
    _id?: Id<'users'>;
    lastSeenMessageId?: Id<'messages'>;
    username?: string;
    [key: string]: unknown;
  }[];
};

const Body = ({ members }: Props) => {
  const { conversationId } = useConversation();
  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<'conversations'>,
  });
  const { mutate: markRead } = useMutationState(api.conversation.markRead);
  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        conversationId,
        messageId: messages[0].message._id,
      });
    }
  }, [messages, conversationId]);

  const getSeenMessage = (messageId: Id<'messages'>) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) => user.username!.split(' ')[0]);

    return seenUsers;
  };

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, index) => {
          const lastByUser =
            messages[index - 1]?.message.senderId ===
            messages[index].message.senderId;

          const seenUsers = isCurrentUser
            ? getSeenMessage(message._id)
            : [];

          return (
            <Message
              key={message._id}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
              createdAt={message._creationTime}
              seen={<SeenBy seenUsers={seenUsers} />}
              type={message.type}
            />
          );
        }
      )}
    </div>
  );
};

interface SeenByProps {
  seenUsers: string[];
}
const SeenBy = ({ seenUsers }: SeenByProps) => {
  const pClassName = 'text-muted-foreground text-sm text-right cursor-default';
  switch (seenUsers.length) {
    case 0:
      return '';
    case 1:
      return <p className={pClassName}>{`Seen by ${seenUsers[0]}`}</p>;
    case 2:
      return (
        <p className={pClassName}>{`Seen by ${seenUsers[0]} and ${seenUsers[1]}`}</p>
      );
    default:
      return (
        <TooltipWrapper
          content={
            <ul>
              {seenUsers.map((name, index) => {
                return <li key={index}>{name}</li>;
              })}
            </ul>
          }
        >
          <p className={pClassName}>{`Seen by ${
            seenUsers[0]
          }, ${seenUsers[1]}, and ${seenUsers.length - 2} more`}</p>
        </TooltipWrapper>
      );
  }
};

export default Body;
