import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendApiError,
  throwMethodNotAllowed,
} from "@/modules/common/server/error";
import { signInUser, signInSchema } from "@/modules/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        await handlePOST(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["POST"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
  }
}

// Sign in a user
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = signInSchema.parse(req.body);

  const data = await signInUser({
    email,
    password,
  });

  res.status(200).json({
    data,
  });
};
