import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendApiError,
  throwMethodNotAllowed,
} from "@/modules/common/server/error";
import { signInUser } from "@/modules/auth/server";
import { signInSchema } from "@/modules/auth/schemas";

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
