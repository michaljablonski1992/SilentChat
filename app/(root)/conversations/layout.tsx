import ItemList from '@/components/shared/item-list/ItemList';

interface Props{
  children: React.ReactNode
}

const ConversationsLayout = ({ children }: Props) => {
  return <><ItemList title='Converstations'>Converstations Page</ItemList>{ children }</>;
}

export default ConversationsLayout;