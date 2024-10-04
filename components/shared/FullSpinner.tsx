import LoaderSpinner from '@/components/shared/LoaderSpinner';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

interface Props {
  text?: string;
  open: boolean
}

const FullSpinner: React.FC<Props> = ({ text, open }: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="text-zinc-200 bg-transparent border-transparent shadow-transparent flex justify-center place-items-center flex-col text-lg">
        <LoaderSpinner className="h-28 w-28" />
        {text ? <p>{text}</p> : null}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FullSpinner;
