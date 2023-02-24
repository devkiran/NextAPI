import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendApiError,
  throwMethodNotAllowed,
} from "@/modules/common/server/error";
import { createUserAccount } from "@/modules/auth/server";
import { signUpSchema } from "@/modules/auth/schemas";

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
        throwMethodNotAllowed(res, method, ["POST"]);
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
