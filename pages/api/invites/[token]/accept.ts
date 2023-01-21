import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/server/prisma";
import { addTeamMember } from "@/lib/server/team";

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

  const invitation = await prisma.invitation.findUniqueOrThrow({
    where: {
      token,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: invitation.email,
    },
  });

  if (!user) {
    throw new Error(
      "An account with this email does not exist. Please sign up before accepting the invitation."
    );
  }

  const team = await prisma.team.findUniqueOrThrow({
    where: {
      id: invitation.teamId,
    },
  });

  await addTeamMember({
    teamId: team.id,
    userId: user.id,
    role: invitation.role,
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
  });
};
