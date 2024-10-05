import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { type Conversation } from '@/convex/conversation';
import { useConversation } from "@/hooks/useConversation";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";
type Props = {
  conversations: Conversation[]
};

const ConversationList = ({
  conversations
}: Props) => {
  const { conversationId: activeConversationId } = useConversation();

  return (
    conversations.map((conversation) => {
      return conversation.isGroup ? (
        <ConversationItem                
          key={conversation._id}
          id={conversation._id}
          mode='group'
          name={conversation.name!}
          lastMessageSender={conversation.lastMessage?.sender}
          lastMessageContent={conversation.lastMessage?.content}
          active={activeConversationId === conversation._id}
        />
      ) : (
        <ConversationItem
          key={conversation._id}
          id={conversation._id}
          mode='private'
          name={conversation.otherMembers[0]!.username || ''}
          imageUrl={conversation.otherMembers[0]!.imageUrl || ''}
          lastMessageSender={conversation.lastMessage?.sender}
          lastMessageContent={conversation.lastMessage?.content}
          active={activeConversationId === conversation._id}
        />
      );
    })
  );
};

// ConversationItem
const ConversationItemMods = ['private', 'group'] as const;
type ConversationItemProps = {
  id: Id<"conversations">;
  mode: (typeof ConversationItemMods)[number];
  imageUrl?: string;
  name: string;
  lastMessageSender?: string;
  lastMessageContent?: string[];
  active: boolean;
};
const ConversationItem = ({
  id,
  mode,
  imageUrl,
  name,
  lastMessageSender,
  lastMessageContent,
  active
}: ConversationItemProps) => {
  const isGroup = mode === 'group';

  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className={`p-2 flex flex-row items-center justify-between ${active ? 'bg-secondary' : ''}`}>
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            {!isGroup && imageUrl && <AvatarImage src={imageUrl} />}
            <AvatarFallback>
              {isGroup && name.charAt(0).toLocaleUpperCase()} 
              {!isGroup && <User />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">
                  {lastMessageSender}
                  {":"}&nbsp;
                </p>
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start the conversation!
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ConversationList;