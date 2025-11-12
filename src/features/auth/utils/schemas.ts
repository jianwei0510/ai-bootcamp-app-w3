import z from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(3, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
