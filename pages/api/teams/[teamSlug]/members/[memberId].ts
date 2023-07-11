import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { sendApiError } from "@/modules/common/server/error";
import {
  getTeam,
  removeTeamMember,
  updateTeamMember,
  isTeamAdmin,
  updateTeamMemberSchema,
} from "@/modules/teams";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "PUT":
        await handlePUT(req, res);
        break;
      case "DELETE":
        await handleDELETE(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["PUT", "DELETE"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
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

  res.status(200).json({
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

  res.status(200).json({
    data: {
      status: "success",
    },
  });
};
