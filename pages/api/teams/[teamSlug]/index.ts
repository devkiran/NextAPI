import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { sendApiError } from "@/modules/common/server/error";
import { updateTeamSchema } from "@/modules/teams/schemas";
import {
  getTeamWithMembers,
  isTeamAdmin,
  getTeam,
  updateTeam,
  deleteTeam,
} from "@/modules/teams/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGET(req, res);
      case "PUT":
        return await handlePUT(req, res);
      case "DELETE":
        return await handleDELETE(req, res);
      default:
        res.setHeader("Allow", "GET, PUT, DELETE");
        throw new Error(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return sendApiError(res, error);
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

  return res.status(200).json({
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

  return res.status(200).json({
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

  return res.status(200).json({
    data: {},
  });
};
