'use client';

import ItemList from '@/components/shared/item-list/ItemList';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoaderSpinner from '@/components/shared/LoaderSpinner';
import CreateGroupDialog from './_components/CreateGroupDialog';
import ConversationList from './_components/ConversationsList';

interface Props {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Converstations" action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            <ConversationList conversations={conversations} />
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
