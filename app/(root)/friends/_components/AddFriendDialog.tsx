'use client';

import TooltipWrapper from '@/components/shared/TooltipWrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty" }).max(320, { message: "Email is too long" })
    .email('Please enter a valid email'),
});

const AddFriendDialog = () => {
  const { mutate: createRequest, pending } = useMutationState(
    api.request.create
  );

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset();
        toast.success('Friend request sent!');
      })
      .catch((error: unknown) => {
        toast.error(error instanceof ConvexError ? error.data : 'Unexpected error occurred');
      });
  };

  return (
    <Dialog>
      <TooltipWrapper content="Add Friend">
        <Button size="icon" variant="outline">
          <DialogTrigger asChild>
            <UserPlus />
          </DialogTrigger>
        </Button>
      </TooltipWrapper>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with your friends!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
