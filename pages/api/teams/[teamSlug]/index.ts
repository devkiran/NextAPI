import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { sendApiError } from "@/modules/common/server/error";
import {
  getTeamWithMembers,
  isTeamAdmin,
  getTeam,
  updateTeam,
  deleteTeam,
  updateTeamSchema,
} from "@/modules/teams";
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
      case "PUT":
        await handlePUT(req, res);
        break;
      case "DELETE":
        await handleDELETE(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["GET", "PUT", "DELETE"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
  }
}

// Get the details of an team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeamWithMembers(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You are not an admin of this team");
  }

  res.status(200).json({
    data: team,
  });
};

// Update a team
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You are not an admin of this team");
  }

  const { name, slug } = updateTeamSchema.parse(req.body);

  const updatedTeam = await updateTeam({
    name,
    slug,
    team,
  });

  res.status(200).json({
    data: updatedTeam,
  });
};

// Delete the team
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You are not an admin of this team");
  }

  await deleteTeam(team);

  res.status(200).json({
    data: {},
  });
};
