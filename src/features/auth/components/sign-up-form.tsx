"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "../lib/client";
import { SignUpSchema, type SignUpSchemaType } from "../utils/schemas";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitHandler = async (data: SignUpSchemaType) => {
    startTransition(async () => {
      await authClient.signUp.email(data, {
        onSuccess: () => {
          toast.success("Account created successfully");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to create account");
        },
      });
    });
  };

  return (
    <Card {...props}>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Create an account</CardTitle>
        <CardDescription className='text-balance'>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitHandler)}>
          <FieldGroup>
            {/* Name */}
            <Controller
              name='name'
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Name</FieldLabel>
                  <Input
                    {...field}
                    id='name'
                    aria-invalid={fieldState.invalid}
                    placeholder='John Doe'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name='email'
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='email'
                    aria-invalid={fieldState.invalid}
                    placeholder='user@example.com'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name='password'
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Input
                    {...field}
                    id='password'
                    type='password'
                    placeholder='Enter your password'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name='confirmPassword'
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='confirm-password'>
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id='confirm-password'
                    type='password'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter your password again'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button type='submit' disabled={isPending}>
                  {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
                  Create Account
                </Button>

                <FieldDescription className='px-6 text-center'>
                  Already have an account? <Link href='/'>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
