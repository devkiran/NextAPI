import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/server/prisma";

const schemaSignIn = z.object({
  email: z.string(),
  password: z.string(),
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

// Sign in a user
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = schemaSignIn.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      data: null,
      error: response.error,
    });
  }

  const { email, password } = response.data;

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

  return res.status(200).json({
    data,
    error: null,
  });
};
