import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/server/prisma";
import { canCreateInvite, canReadInvite } from "@/lib/server/accessControls";
import { getCurrentUser } from "@/lib/server/user";
import { getTeam } from "@/lib/server/team";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        return await handlePOST(req, res);
      case "GET":
        return await handleGET(req, res);
      default:
        res.setHeader("Allow", "POST, GET");
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

  const currentUser = await getCurrentUser(req);

  const team = await getTeam(teamSlug);

  const { email, role } = response.data;

  if (!(await canCreateInvite(currentUser, team))) {
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

// Get all invitations for a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const team = await prisma.team.findUniqueOrThrow({
    where: {
      slug: teamSlug,
    },
  });

  const currentUser = await getCurrentUser(req);

  if (!(await canReadInvite(currentUser, team, null))) {
    throw new Error("You are not allowed to see invitations for this team");
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      teamId: team.id,
    },
  });

  return res.status(200).json({
    data: invitations,
    error: null,
  });
};
