"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "../lib/client";
import { LoginSchema, type LoginSchemaType } from "../utils/schemas";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (data: LoginSchemaType) => {
    startTransition(async () => {
      await authClient.signIn.email(data, {
        onSuccess: () => {
          toast.success("Logged in successfully");
          onOpenChange(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to login");
        },
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Welcome Back
          </DialogTitle>
          <DialogDescription className='text-center text-balance'>
            Sign in to manage your todos and keep them synced across devices
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FieldGroup>
              <Controller
                name='email'
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='email'
                      aria-invalid={fieldState.invalid}
                      placeholder='user@example.com'
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='password'
                disabled={isPending}
                control={form.control}
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
                Login
              </Button>
              <FieldDescription className='text-center'>
                Don&apos;t have an account?{" "}
                <Link href='/auth/sign-up' className='ml-1'>
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <p className='text-xs text-center text-balance text-muted-foreground px-8'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
