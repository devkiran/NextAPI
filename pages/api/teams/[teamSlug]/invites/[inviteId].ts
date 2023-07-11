import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/modules/common/server/prisma";
import { getCurrentUser } from "@/modules/common/server/auth";
import { getTeam, isTeamAdmin } from "@/modules/teams";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        await handleGET(req, res);
        break;
      case "DELETE":
        await handleDELETE(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["GET", "DELETE"]);
    }
  } catch (error: any) {
    res.status(400).json({
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

  res.status(200).json({
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

  res.status(200).json({
    data: {},
  });
};
