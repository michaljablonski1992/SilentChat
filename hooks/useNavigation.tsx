import { useQuery } from 'convex/react';
import { MessageSquare, User, MonitorSmartphone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { api } from "@/convex/_generated/api";

// main is for main navigation, other is for other purposes
type Types = ['main', 'other'];
export type Path = {
  id: string;
  type: Types[number];
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
        id: 'conversations',
        type: 'main',
        name: 'Conversations',
        href: '/conversations',
        icon: <MessageSquare />,
        active: pathname.startsWith('/conversations'), // for /conversations and /conversations/[:id]
        count: unseenMessagesCount
      },
      {
        id: 'friends',
        type: 'main',
        name: 'Friends',
        href: '/friends',
        icon: <User />,
        active: pathname === '/friends',
        count: requestCount
      },
      {
        id: 'installation',
        type: 'other',
        name: 'Installation',
        href: '/installation',
        icon: <MonitorSmartphone />,
        active: pathname === '/installation',
      },
    ];
    return _paths;
  }, [pathname, requestCount, unseenMessagesCount]);

  return paths;
};
