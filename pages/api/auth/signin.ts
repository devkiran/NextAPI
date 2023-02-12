import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { signInUser } from "@/lib/server/auth";
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

// Sign in a user
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      error: response.error,
    });
  }

  const { email, password } = response.data;

  const data = await signInUser({
    email,
    password,
  });

  return res.status(200).json({
    data,
  });
};
