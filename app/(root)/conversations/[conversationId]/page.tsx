"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import ChatInput from "./_components/input/ChatInput";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import LoaderSpinner from "@/components/shared/LoaderSpinner";
import ConversationContent from "./_components/ConversationContent";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId });
  console.log(conversation);

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
      <ConversationContent conversation={conversation} />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;