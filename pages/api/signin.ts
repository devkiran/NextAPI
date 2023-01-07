import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { supabase } from "@/lib/supabase";
import { sendSuccess } from "@/lib/response";

const schemaSignIn = z.object({
  email: z.string(),
  password: z.string(),
});

const allowedMethods = ["POST"];

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
        res.setHeader("Allow", allowedMethods.join(", "));
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

  // Sign in the user in Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return sendSuccess(res, 200, data);
};
