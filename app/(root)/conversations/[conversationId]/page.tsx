'use client';

import ConversationContainer from '@/components/shared/conversation/ConversationContainer';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import LoaderSpinner from '@/components/shared/LoaderSpinner';
import Header from './_components/Header';
import Body from './_components/body/Body';
import { useState } from 'react';
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog';
import ChatInput from './_components/input/ChatInput';

interface Props {
  params: {
    conversationId: Id<'conversations'>;
  };
}

const ConversationsPage = ({ params }: Props) => {
  const conversation = useQuery(api.conversation.get, {
    id: params.conversationId,
  });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState<boolean>(false);

  return conversation === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderSpinner />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} conversationId={conversation._id}/>
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember?.username) || ''
        }
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember?.imageUrl
        }
        options={
          conversation.isGroup
            ? []
            : [
                {
                  label: 'Remove friend',
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers
              ? conversation.otherMembers
              : []
            : conversation.otherMember
              ? [conversation.otherMember]
              : []
        }
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationsPage;
