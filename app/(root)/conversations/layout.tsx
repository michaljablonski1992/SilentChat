'use client';

import ItemList from '@/components/shared/item-list/ItemList';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoaderSpinner from '@/components/shared/LoaderSpinner';
import DMConversationItem from './_components/DMConversationItem';

interface Props {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Converstations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations.map((conversation) => {
              return (
                <DMConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  username={conversation.otherMember?.username || ''}
                  imageUrl={conversation.otherMember?.imageUrl || ''}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                />
              );
            })
          )
        ) : (
          <LoaderSpinner />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
