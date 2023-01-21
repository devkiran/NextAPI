import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/server/prisma";

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
      data: null,
      error: {
        message: error.message,
      },
    });
  }
}

// Decline the invitation
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query as { token: string };

  const invitation = await prisma.invitation.findUniqueOrThrow({
    where: {
      token,
    },
  });

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });

  return res.status(200).json({
    data: {
      success: true,
    },
    error: null,
  });
};
