"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import superjson from "superjson";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTodoSchemaType } from "@/features/todo/utils/schemas";
import { CreateTodoSchema } from "@/features/todo/utils/schemas";
import { createTodo } from "../server/actions";

export const CreateTodoForm = ({
  randomTodo,
}: {
  randomTodo: { title: string; description: string };
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTodoSchemaType>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const submitHandler = async (data: CreateTodoSchemaType) => {
    const dataString = superjson.stringify(data);
    startTransition(async () => {
      const result = await createTodo(dataString);
      if (result?.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result?.message || "Failed to create todo");
      }
    });
  };

  return (
    <Card className='w-full min-w-sm max-w-md'>
      <CardHeader className='space-y-1'>
        <div className='flex items-center gap-2'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-primary/10'>
            <PlusIcon className='size-4 text-primary' />
          </div>
          <CardTitle
            className='text-lg'
            style={{ fontFamily: "var(--font-outfit)" }}>
            Create Todo
          </CardTitle>
        </div>
        <CardDescription>
          Add a new task to your list
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='create-todo-form'
          onSubmit={form.handleSubmit(submitHandler)}>
          <FieldGroup>
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invailid={fieldState.invalid}>
                  <FieldLabel className='text-sm font-medium'>Title</FieldLabel>
                  <Input
                    type='text'
                    {...field}
                    placeholder={randomTodo.title}
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
                <Field data-invailid={fieldState.invalid}>
                  <FieldLabel className='text-sm font-medium'>
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder={randomTodo.description}
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
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button
          type='submit'
          form='create-todo-form'
          disabled={isPending}
          className='glow-primary min-w-28 gap-2 font-medium transition-all duration-200'>
          {isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Creating...
            </>
          ) : (
            <>
              <PlusIcon className='size-4' />
              Create
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
