import { Card } from '@/components/ui/card';

interface Props {
  children: React.ReactNode
}

const ConversationContainer = ({ children }: Props) => {
  return (
    <Card className="w-full h-[calc(100svh-32px)] lg:h-full p-2 flex flex-col gap-2">
      Select/start a conversation to get started!
    </Card>
  );
};

export default ConversationContainer;
