import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/server/prisma";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/server/email/sendEmail";

const schemaSignUp = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        return await handlePOST(req, res);
      default:
        res.setHeader("Allow", "POST");
        throw new Error(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(400).json({
      data: null,
      error: {
        message: error.message,
      },
    });
  }
}

// Create a new user account
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = schemaSignUp.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      data: null,
      error: response.error,
    });
  }

  const { email, firstName, lastName, password } = response.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: response.data.email,
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

  return res.status(201).json({
    data: newUser,
    error: null,
  });
};
