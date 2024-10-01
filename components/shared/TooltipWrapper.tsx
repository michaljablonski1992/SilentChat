'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

interface Props {
  children: React.ReactNode;
  content: string;
}

const TooltipWrapper: React.FC<Props> = ({ children, content }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        {children}
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 ring-1 rounded-md bg-slate-50 ring-zinc-300 ring-inset z-50">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper
