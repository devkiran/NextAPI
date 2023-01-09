import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/server/prisma";
import { canInviteMember } from "@/lib/server/accessControls";
import { getCurrentUser } from "@/lib/server/user";

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

// Send a new invitation
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const schema = z.object({
    email: z.string().email(),
    role: z.enum(["admin", "member"]),
  });

  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      data: null,
      error: response.error.format(),
    });
  }

  const { email, role } = response.data;

  const team = await prisma.team.findUniqueOrThrow({
    where: {
      slug: teamSlug,
    },
  });

  const currentUser = await getCurrentUser(req);

  if (!(await canInviteMember(currentUser, team))) {
    throw new Error("You are not allowed to invite members to this team");
  }

  const existingInvitation = await prisma.invitation.count({
    where: {
      email,
      teamId: team.id,
    },
  });

  if (existingInvitation > 0) {
    throw new Error(
      `An invitation has already been sent to ${email} for this team`
    );
  }

  const newInvitation = await prisma.invitation.create({
    data: {
      email,
      role: role.toUpperCase(),
      teamId: team.id,
      InvitedBy: currentUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
  });

  return res.status(201).json({
    data: newInvitation,
    error: null,
  });
};
