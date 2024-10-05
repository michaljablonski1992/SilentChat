import { useState } from 'react';
import RemoveFriendDialog from './dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './dialogs/LeaveGroupDialog';
import Header from './Header';
import Body from './body/Body';
import { type Conversation } from '@/convex/conversation';

interface Props {
  conversation: Conversation;
}

const ConversationContent = ({ conversation }: Props) => {
  const isGroup = conversation.isGroup;

  return (
    <>
      {!isGroup && <PrivateConversationContent conversation={conversation} />}
      {isGroup && <GroupConversationContent conversation={conversation} />}
    </>
  );
};

const PrivateConversationContent = ({ conversation }: Props) => {
  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);

  return (
    <>
      <RemoveFriendDialog
        conversationId={conversation._id}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <Header
        name={conversation.otherMembers[0]?.username || ''}
        imageUrl={conversation.otherMembers[0]?.imageUrl}
        options={[
          {
            label: 'Remove friend',
            destructive: true,
            onClick: () => setRemoveFriendDialogOpen(true),
          },
        ]}
      />
      <Body members={[conversation.otherMembers[0]]} />
    </>
  );
};

const GroupConversationContent = ({ conversation }: Props) => {
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

  return (
    <>
      <DeleteGroupDialog
        conversationId={conversation._id}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversation._id}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        name={conversation.name || ''}
        options={[
          {
            label: 'Leave group',
            destructive: false,
            onClick: () => setLeaveGroupDialogOpen(true),
          },
          {
            label: 'Delete group',
            destructive: true,
            onClick: () => setDeleteGroupDialogOpen(true),
          },
        ]}
      />
      <Body members={conversation.otherMembers} />
    </>
  );
};

export default ConversationContent;
