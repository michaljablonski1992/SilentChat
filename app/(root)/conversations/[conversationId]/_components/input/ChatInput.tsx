'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { SendHorizonal } from 'lucide-react';
import {
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConvexError } from 'convex/values';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useConversation } from '@/hooks/useConversation';
import LoaderSpinner from '@/components/shared/LoaderSpinner';
import ChatEmojiPicker from './ChatEmojiPicker';

type ChatInputProps = {};

const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message can't be empty" })
    .max(512, { message: 'Message is too long' }),
});

const ChatInput: React.FC<ChatInputProps> = ({}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const { conversationId } = useConversation();
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: '',
    },
  });
  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement> | MouseEvent<HTMLTextAreaElement>
  ) => {
    const { value, selectionStart } = event.target as HTMLTextAreaElement;
    if (selectionStart !== null) {
      form.setValue('content', value);
      setCursorPosition(selectionStart);
    }
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      content: [values.content],
      type: 'text',
      conversationId,
    })
      .then(() => {
        form.reset();
        textareaRef.current?.focus();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : 'Unexpected error occurred'
        );
      });
  };

  const onEnterMessage = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !pending) {
      event.preventDefault();
      await form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <ChatEmojiPicker
          form={form}
          targetRef={textareaRef}
          cursorPosition={cursorPosition}
          setCursorPositionHandler={setCursorPosition}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormControl ref={textareaRef}>
                    <TextareaAutosize
                      onKeyDown={onEnterMessage}
                      autoFocus
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onClick={handleInputChange}
                      placeholder="Type a message..."
                      className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size="icon" type="submit">
              {!pending && <SendHorizonal />}
              {pending && <LoaderSpinner />}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
