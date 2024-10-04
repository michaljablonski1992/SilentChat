import { Loader2 } from 'lucide-react';
import { ReactElement } from 'react';

interface Props {
  className?: string
}

const LoaderSpinner = ({ className }: Props): ReactElement => {
  return <Loader2 className={`h-8 w-8 animate-spin ${className || ''}`} />;
}

export default LoaderSpinner;
