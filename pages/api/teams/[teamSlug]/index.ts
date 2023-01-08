import type { NextApiRequest, NextApiResponse } from "next";
import { getTeamWithMembers } from "@/lib/server/team";
import { getCurrentUser } from "@/lib/supabase";

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

// Get the details of an team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeamWithMembers(teamSlug);

  const isMember = team.members.some(
    (member) => member.userId === currentUser.id
  );

  if (!isMember) {
    throw new Error("You are not a member of this team");
  }

  return res.status(200).json({
    data: team,
    error: null,
  });
};

// Delete the team
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as { teamSlug: string };

  const currentUser = await getCurrentUser(req);
  const team = await getTeamWithMembers(teamSlug);

  const isAdmin = team.members.some(
    (member) => member.userId === currentUser.id && member.role === "admin"
  );

  if (!isAdmin) {
    throw new Error("You are not an admin of this team");
  }

  return res.status(200).json({
    data: {},
    error: null,
  });
};
