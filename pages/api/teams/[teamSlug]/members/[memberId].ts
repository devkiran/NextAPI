import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/lib/server/user";
import { getTeam, isTeamAdmin } from "@/lib/server/team";
import { removeTeamMember, updateTeamMember } from "@/lib/server/member";
import { updateTeamMemberSchema } from "@/lib/schema";
import { sendApiError } from "@/lib/error";

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

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamAdmin(currentUser, team))) {
    throw new Error("You do not have permission to access this team");
  }

  const { role } = updateTeamMemberSchema.parse(req.body);

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

  await removeTeamMember({ teamSlug, memberId }, await getCurrentUser(req));

  return res.status(200).json({
    data: {
      status: "success",
    },
  });
};
