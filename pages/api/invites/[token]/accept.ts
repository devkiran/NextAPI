import type { NextApiRequest, NextApiResponse } from "next";
import { acceptInvitation } from "@/modules/invites";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

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
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
}

// Accept the invitation
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query as { token: string };

  await acceptInvitation(token);

  res.status(200).json({
    data: {
      success: true,
    },
  });
};
