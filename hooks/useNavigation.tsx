import { useQuery } from 'convex/react';
import { MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { api } from "@/convex/_generated/api";

export type Path = {
  name: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  count?: number;
};

export const useNavigation = () => {
  const pathname = usePathname();

  const requestCount = useQuery(api.requests.count);
  const conversations = useQuery(api.conversations.get);

  const unseenMessagesCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount;
    }, 0);
  }, [conversations]);

  const paths = useMemo(() => {
    const _paths: Path[] = [
      {
        name: 'Conversations',
        href: '/conversations',
        icon: <MessageSquare />,
        active: pathname.startsWith('/conversations'), // for /conversations and /conversations/[:id]
        count: unseenMessagesCount
      },
      {
        name: 'Friends',
        href: '/friends',
        icon: <User />,
        active: pathname === '/friends',
        count: requestCount
      },
    ];
    return _paths;
  }, [pathname, requestCount, unseenMessagesCount]);

  return paths;
};
