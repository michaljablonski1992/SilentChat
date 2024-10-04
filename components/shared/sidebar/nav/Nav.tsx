'use client';

import { useNavigation, type Path } from '@/hooks/useNavigation';
import { Card } from '@/components/ui/card';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/shared/TooltipWrapper';
import { useConversation } from '@/hooks/useConversation';
import { ThemeToggle } from '@/components/ui/theme/ThemeToggle';

const Mods = ['desktop', 'mobile'] as const;
interface Props {
  mode: (typeof Mods)[number];
}

const Nav = ({ mode = Mods[0] }: Props) => {
  const paths = useNavigation();
  const isMobile = mode === 'mobile';

  if (isMobile) {
    const { isActive } = useConversation();
    if (isActive) {
      return null;
    }
  }

  // style depending on mobile/desktop view
  let cardClassName, navClassName, ulClassName;
  if (isMobile) {
    cardClassName =
      'fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden';
    navClassName = 'w-full';
    ulClassName = 'flex justify-evenly items-center';
  } else {
    // desktop
    cardClassName =
      'hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4';
    ulClassName = 'flex flex-col items-center gap-4';
  }

  return (
    <Card className={cardClassName}>
      <nav className={navClassName}>
        <ul className={ulClassName}>
          {paths.map((path, id) => {
            return (
              <li key={id} className="">
                <NavLink path={path} />
              </li>
            );
          })}
          {isMobile && (
            <>
              <li>
                <ThemeToggle />
              </li>
              <li>
                <UserButton />
              </li>
            </>
          )}
        </ul>
      </nav>
      {!isMobile && (
        <div className="flex flex-col items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      )}
    </Card>
  );
};

interface NavLinkProps {
  path: Path;
}
const NavLink = ({ path }: NavLinkProps) => {
  return (
    <Link href={path.href}>
      <TooltipWrapper content={path.name}>
        <Button size="icon" variant={path.active ? 'default' : 'outline'}>
          {path.icon}
        </Button>
      </TooltipWrapper>
    </Link>
  );
};

export default Nav;
