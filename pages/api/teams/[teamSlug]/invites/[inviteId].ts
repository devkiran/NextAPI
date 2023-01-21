import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/server/prisma";
import { getCurrentUser } from "@/lib/server/user";
import { getTeam } from "@/lib/server/team";
import { isTeamAdmin } from "@/lib/server/team";

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

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You do not have permission to view this invitation");
  }

  const invitation = await prisma.invitation.findFirstOrThrow({
    where: {
      id: parseInt(inviteId),
      teamId: team.id,
    },
  });

  return res.status(200).json({
    data: invitation,
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
      teamId: team.id,
    },
  });

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You do not have permission to view this invitation");
  }

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });

  return res.status(200).json({
    data: {},
  });
};
