import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { sendApiError } from "@/modules/common/server/error";
import { createTeam, getTeams, createTeamSchema } from "@/modules/teams";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        await handlePOST(req, res);
        break;
      case "GET":
        await handleGET(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["POST", "GET"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
  }
}

// Create a new team
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, slug } = createTeamSchema.parse(req.body);

  const team = await createTeam({
    name,
    slug,
    user: await getCurrentUser(req),
  });

  res.status(201).json({
    data: team,
  });
};

// Get all teams for the current user
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const currentUser = await getCurrentUser(req);
  const teams = await getTeams(currentUser);

  res.status(200).json({
    data: teams,
  });
};
