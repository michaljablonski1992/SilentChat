'use client';

import FullSpinner from '@/components/shared/FullSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  conversationId: Id<'conversations'>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
  const [fullSpinnerOpen, setFullSpinnerOpen] = useState<boolean>(false);
  const { mutate: deleteGroup, pending } = useMutationState(
    api.conversation.deleteGroup
  );

  const handleDeleteGroup = async () => {
    setFullSpinnerOpen(true);
    deleteGroup({ conversationId })
      .then(() => {
        toast.success('The group has been deleted');
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : 'Unexpected error occurred'
        );
        setFullSpinnerOpen(false);
      });
  };

  return (
    <>
      <FullSpinner open={fullSpinnerOpen} text="This could take a while..." />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All messages will be deleted and you
              will not be able to message this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              disabled={pending}
              onClick={handleDeleteGroup}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteGroupDialog;
