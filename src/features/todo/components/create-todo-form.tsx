"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import superjson from "superjson";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { User } from "@/features/auth/utils/user";
import type { CreateTodoSchemaType } from "@/features/todo/utils/schemas";
import { CreateTodoSchema } from "@/features/todo/utils/schemas";
import { createTodo } from "../server/actions";

const DUMMY_TODOS = [
  {
    title: "Buy groceries for the week",
    description: "Get milk, eggs, bread, fruits, vegetables, and other essentials from the supermarket",
  },
  {
    title: "Schedule dentist appointment",
    description: "Call the dental clinic to book a checkup appointment for next month",
  },
  {
    title: "Finish reading current book",
    description: "Complete the last three chapters and write a brief review",
  },
  {
    title: "Plan weekend trip",
    description: "Research destinations, book accommodation, and create an itinerary for the family vacation",
  },
  {
    title: "Exercise for 30 minutes",
    description: "Go for a jog in the park or do a home workout routine",
  },
  {
    title: "Call mom and catch up",
    description: "Have a video call to check in and share recent updates",
  },
  {
    title: "Organize home office",
    description: "Declutter desk, file documents, and clean up workspace for better productivity",
  },
  {
    title: "Pay monthly bills",
    description: "Review and pay electricity, internet, and credit card bills before due date",
  },
  {
    title: "Learn a new recipe",
    description: "Try making homemade pasta or baking sourdough bread this weekend",
  },
  {
    title: "Clean out email inbox",
    description: "Unsubscribe from unwanted newsletters and organize important emails into folders",
  },
];

export const CreateTodoForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { session } = User();

  // Randomly select a dummy todo on mount
  const randomTodo = useMemo(() => {
    return DUMMY_TODOS[Math.floor(Math.random() * DUMMY_TODOS.length)];
  }, []);

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

  const handleFocus = () => {
    if (!session?.user) {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <>
      <Card className='w-full min-w-sm max-w-md'>
        <CardHeader>
          <CardTitle>Create Todo</CardTitle>
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
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type='text'
                      {...field}
                      placeholder={randomTodo.title}
                      data-invalid={fieldState.invalid}
                      disabled={isPending}
                      onFocus={handleFocus}
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
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder={randomTodo.description}
                      data-invalid={fieldState.invalid}
                      disabled={isPending}
                      onFocus={handleFocus}
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
          <Button type='submit' form='create-todo-form' disabled={isPending}>
            {isPending && <Loader2 className='w-4 h-4 animate-spin' />} Create
          </Button>
        </CardFooter>
      </Card>
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </>
  );
};
