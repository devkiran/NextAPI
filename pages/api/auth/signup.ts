import type { NextApiRequest, NextApiResponse } from "next";
import { createUserAccount } from "@/lib/server/auth";
import { sendApiError } from "@/lib/error";
import { signUpSchema } from "@/lib/schema";

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
  const { email, firstName, lastName, password } = signUpSchema.parse(req.body);

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
