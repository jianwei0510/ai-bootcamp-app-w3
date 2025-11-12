import { SignupForm } from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className='flex flex-col gap-4 min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted'>
      <h1 className='text-2xl font-bold'>WUC Todo</h1>
      <div className='w-full max-w-md'>
        <SignupForm />
      </div>
    </div>
  );
}
