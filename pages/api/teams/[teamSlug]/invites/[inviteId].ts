import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/server/prisma";
import { canDeleteInvite, canReadInvite } from "@/lib/server/accessControls";
import { getCurrentUser } from "@/lib/server/user";
import { getTeam } from "@/lib/server/team";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGET(req, res);
      case "DELETE":
        return await handleDELETE(req, res);
      default:
        res.setHeader("Allow", "GET, DELETE");
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

// Get a invitation by id
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug, inviteId } = req.query as {
    teamSlug: string;
    inviteId: string;
  };

  const currentUser = await getCurrentUser(req);

  const team = await getTeam(teamSlug);

  const invitation = await prisma.invitation.findFirstOrThrow({
    where: {
      id: parseInt(inviteId),
    },
  });

  if (!(await canReadInvite(currentUser, team, invitation))) {
    throw new Error("You do not have permission to view this invitation");
  }

  return res.status(200).json({
    data: invitation,
    error: null,
  });
};

// Delete a invitation by id
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug, inviteId } = req.query as {
    teamSlug: string;
    inviteId: string;
  };

  const currentUser = await getCurrentUser(req);

  const team = await getTeam(teamSlug);

  const invitation = await prisma.invitation.findFirstOrThrow({
    where: {
      id: parseInt(inviteId),
    },
  });

  if (!(await canDeleteInvite(currentUser, team, invitation))) {
    throw new Error("You do not have permission to delete this invitation");
  }

  await prisma.invitation.delete({
    where: {
      id: parseInt(inviteId),
    },
  });

  return res.status(200).json({
    data: {},
    error: null,
  });
};
