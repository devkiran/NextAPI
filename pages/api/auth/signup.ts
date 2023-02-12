import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { createUserAccount } from "@/lib/server/auth";
import { sendApiError } from "@/lib/error";

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
    return sendApiError(res, error);
  }
}

// Create a new user account
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });

  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      error: response.error,
    });
  }

  const { email, firstName, lastName, password } = response.data;

  const newUser = await createUserAccount({
    email,
    firstName,
    lastName,
    password,
  });

  return res.status(201).json({
    data: newUser,
  });
};
