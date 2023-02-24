import z from "zod";
import { signUpSchema, signInSchema } from "./schemas";

export type SignUpParams = z.infer<typeof signUpSchema>;
export type SignInParams = z.infer<typeof signInSchema>;
