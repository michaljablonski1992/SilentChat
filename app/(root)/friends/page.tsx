import ConversationFallback from '@/components/shared/conversation/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';
import AddFriendDialog from './_components/AddFriendDialog';

const Friends = () => {
  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>FriendsPage</ItemList>
      <ConversationFallback />
    </>
  );
};

export default Friends;
