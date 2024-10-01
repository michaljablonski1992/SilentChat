import ConversationFallback from '@/components/shared/conversation/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';

const Friends = () => {
  return (
    <>
      <ItemList title="Friends">FriendsPage</ItemList>
      <ConversationFallback />
    </>
  );
};

export default Friends;
