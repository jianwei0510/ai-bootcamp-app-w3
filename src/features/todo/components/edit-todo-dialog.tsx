"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PencilIcon, SaveIcon } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import superjson from "superjson";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateTodoSchemaType } from "@/features/todo/utils/schemas";
import { UpdateTodoSchema } from "@/features/todo/utils/schemas";
import type { Todo } from "../../../../generated/prisma/client";
import { updateTodo } from "../server/actions";

interface EditTodoDialogProps {
  todo: Todo;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditTodoDialog = ({
  todo,
  open,
  onOpenChange,
}: EditTodoDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateTodoSchemaType>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: {
      id: todo.id,
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
    },
  });

  const submitHandler = async (data: UpdateTodoSchemaType) => {
    const dataString = superjson.stringify(data);
    startTransition(async () => {
      const result = await updateTodo(dataString);
      if (result?.success) {
        toast.success(result.message);
        onOpenChange?.(false);
      } else {
        toast.error(result?.message || "Failed to update todo");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-card border-border/50'>
        <DialogHeader>
          <DialogTitle
            className='flex items-center gap-3 text-lg'
            style={{ fontFamily: "var(--font-outfit)" }}>
            <div className='flex size-8 items-center justify-center rounded-lg bg-primary/10'>
              <PencilIcon className='size-4 text-primary' />
            </div>
            Edit Todo
          </DialogTitle>
        </DialogHeader>
        <form id='edit-todo-form' onSubmit={form.handleSubmit(submitHandler)}>
          <FieldGroup>
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-sm font-medium'>Title</FieldLabel>
                  <Input
                    type='text'
                    {...field}
                    data-invalid={fieldState.invalid}
                    disabled={isPending}
                    className='bg-background/50 transition-all duration-200 focus:bg-background'
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-sm font-medium'>
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    data-invalid={fieldState.invalid}
                    disabled={isPending}
                    className='min-h-24 resize-none bg-background/50 transition-all duration-200 focus:bg-background'
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange?.(false)}
            disabled={isPending}
            className='border-border/50'>
            Cancel
          </Button>
          <Button
            type='submit'
            form='edit-todo-form'
            disabled={isPending}
            className='glow-primary min-w-32 gap-2 font-medium'>
            {isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className='size-4' />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
