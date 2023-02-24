import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { updateTeamMemberSchema } from "@/modules/teams/schemas";
import { sendApiError } from "@/modules/common/server/error";
import {
  getTeam,
  removeTeamMember,
  updateTeamMember,
  isTeamAdmin,
} from "@/modules/teams/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "PUT":
        return await handlePUT(req, res);
      case "DELETE":
        return await handleDELETE(req, res);
      default:
        res.setHeader("Allow", "PUT, DELETE");
        throw new Error(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return sendApiError(res, error);
  }
}

// Update a team member
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug, memberId } = req.query as {
    teamSlug: string;
    memberId: string;
  };

  const { role } = updateTeamMemberSchema.parse(req.body);

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You do not have permission to access this team");
  }

  const member = await updateTeamMember({
    memberId,
    role,
  });

  return res.status(200).json({
    data: member,
  });
};

// Delete a team member
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug, memberId } = req.query as {
    teamSlug: string;
    memberId: string;
  };

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You do not have permission to access this team");
  }

  await removeTeamMember({ memberId });

  return res.status(200).json({
    data: {
      status: "success",
    },
  });
};
