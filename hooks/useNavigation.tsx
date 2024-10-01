import { MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export type Path = {
  name: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
};

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(() => {
    const _paths: Path[] = [
      {
        name: 'Conversations',
        href: '/conversations',
        icon: <MessageSquare />,
        active: pathname.startsWith('/conversations'), // for /conversations and /conversations/[:id]
      },
      {
        name: 'Friends',
        href: '/friends',
        icon: <User />,
        active: pathname === '/friends',
      },
    ];
    return _paths;
  }, [pathname]);

  return paths;
};
