import { Loader2 } from 'lucide-react';
import { ReactElement } from 'react';

const LoaderSpinner = (): ReactElement => {
  return <Loader2 className="h-8 w-8 animate-spin" />;
}

export default LoaderSpinner;
