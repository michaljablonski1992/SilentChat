import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleArrowLeft, Phone, Settings, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
  setCallType: Dispatch<SetStateAction<'audio' | 'video' | null>>;
};

const Header = ({ imageUrl, name, options, setCallType }: Props) => {
  return (
    <Card className="w-full flex rounded-lg items-center p-2 justify-between">
      <div className="flex items-center gap-2 flex-row w-full relative">
        <Link className="block lg:hidden" href="/conversations">
          <CircleArrowLeft />
        </Link>
        <Avatar className="w-8 h-8">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name?.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
        <div className="flex gap-2 absolute right-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCallType('audio')}
          >
            <Phone />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCallType('video')}
          >
            <Video />
          </Button>
          {options ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {options.map((option, id) => {
                  return (
                    <DropdownMenuItem
                      key={id}
                      onClick={option.onClick}
                      className={cn('font-semibold hover:cursor-pointer', {
                        'text-destructive': option.destructive,
                      })}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default Header;
