import z from "zod";

export const signUpSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
});

export const signInSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
