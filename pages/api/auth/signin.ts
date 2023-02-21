import type { NextApiRequest, NextApiResponse } from "next";
import { signInUser } from "@/lib/server/auth";
import { sendApiError } from "@/lib/error";
import { signInSchema } from "@/lib/schema";

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
  const { email, password } = signInSchema.parse(req.body);

  const data = await signInUser({
    email,
    password,
  });

  return res.status(200).json({
    data,
  });
};
