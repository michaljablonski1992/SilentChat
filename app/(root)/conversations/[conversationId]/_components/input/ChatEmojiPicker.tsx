'use client';

import {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { UseFormReturn } from 'react-hook-form';
import { Smile } from 'lucide-react';
interface Props {
  form: UseFormReturn<{ content: string }>;
  targetRef: MutableRefObject<HTMLTextAreaElement | null>;
  cursorPosition: number;
  setCursorPositionHandler: Dispatch<SetStateAction<number>>;
}

const ChatEmojiPicker = ({
  form,
  targetRef,
  cursorPosition,
  setCursorPositionHandler,
}: Props) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { theme } = useTheme();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const content = form.watch('content', '');

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.selectionEnd = cursorPosition;
      targetRef.current.focus();
    }
  }, [cursorPosition])

  const insertEmoji = (emoji: string) => {
    const newText = [
      content.substring(0, cursorPosition),
      emoji,
      content.substring(cursorPosition),
    ].join('');

    form.setValue('content', newText);

    setCursorPositionHandler(cursorPosition + emoji.length);
  };

  const onEmojiClickHandler = (emojiDetails: EmojiClickData) => {
    insertEmoji(emojiDetails.emoji);
    setEmojiPickerOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="absolute bottom-16" ref={emojiPickerRef}>
        <EmojiPicker
          open={emojiPickerOpen}
          theme={theme as Theme}
          onEmojiClick={(emojiDetails) => onEmojiClickHandler(emojiDetails)}
          lazyLoadEmojis
        />
      </div>
      <Button
        variant="outline"
        onClick={() => {
          setEmojiPickerOpen(true);
        }}
        size="icon"
      >
        <Smile />
      </Button>
    </>
  );
};

export default ChatEmojiPicker;
