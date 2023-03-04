import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import crypto from "crypto";
import { prisma } from "@/modules/common/server/prisma";
import { getCurrentUser } from "@/modules/common/server/auth";
import { getTeam, isTeamAdmin } from "@/modules/teams";
import { MemberRole } from "@prisma/client";

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
    role: z.nativeEnum(MemberRole),
  });

  const { email, role } = schema.parse(req.body);

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
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
      role,
      teamId: team.id,
      InvitedBy: currentUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      token: crypto.randomUUID(),
    },
  });

  return res.status(201).json({
    data: newInvitation,
  });
};

// Get all invitations for a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You are not authorized to view this team's invitations");
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      teamId: team.id,
    },
  });

  return res.status(200).json({
    data: invitations,
  });
};
