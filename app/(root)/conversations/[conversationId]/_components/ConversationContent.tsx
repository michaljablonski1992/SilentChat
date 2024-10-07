import { Dispatch, SetStateAction, useState } from 'react';
import RemoveFriendDialog from './dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './dialogs/LeaveGroupDialog';
import Header from './Header';
import Body from './body/Body';
import { Conversation } from '@/convex/conversation';

interface Props {
  conversation: Conversation;
}

const ConversationContent = ({ conversation }: Props) => {
  const isGroup = conversation.isGroup;
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);

  return (
    <>
      {!isGroup && <PrivateConversationContent callType={callType} setCallType={setCallType} conversation={conversation} />}
      {isGroup && <GroupConversationContent callType={callType} setCallType={setCallType} conversation={conversation} />}
    </>
  );
};

interface ConversationProps extends Props {
  callType: 'audio' | 'video' | null;
  setCallType: Dispatch<SetStateAction<'audio' | 'video' | null>>;
}
const PrivateConversationContent = ({ conversation, callType, setCallType }: ConversationProps) => {
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
        setCallType={setCallType}
      />
      <Body
        setCallType={setCallType}
        callType={callType}
        members={[conversation.otherMembers[0]]}
      />
    </>
  );
};

const GroupConversationContent = ({ conversation, callType, setCallType }: ConversationProps) => {
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
        setCallType={setCallType}
      />
      <Body
        setCallType={setCallType}
        callType={callType}
        members={conversation.otherMembers}
      />
    </>
  );
};

export default ConversationContent;
