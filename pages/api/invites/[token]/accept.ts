import type { NextApiRequest, NextApiResponse } from "next";
import { acceptInvitation } from "@/modules/invites";

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

  return res.status(200).json({
    data: {
      success: true,
    },
  });
};
