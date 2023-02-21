import { prisma } from "@/lib/server/prisma";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/server/email/sendEmail";

// Create a new user account
export const createUserAccount = async (params: SignUpParams) => {
  const { email, password, firstName, lastName } = params;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An user with this email already exists.");
  }

  // Create a user in our database
  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
    },
  });

  // Create a new user in Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        appUserId: newUser.id,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Send a welcome email
  await sendWelcomeEmail({ user: newUser });

  return newUser;
};

// Sign in a user
export const signInUser = async (params: SignInParams) => {
  const { email, password } = params;

  await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  // Sign in the user in Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignInParams = {
  email: string;
  password: string;
};
