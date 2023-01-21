import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/server/prisma";
import { getCurrentUser } from "@/lib/server/user";
import { getTeam, isTeamAdmin } from "@/lib/server/team";
import z from "zod";
import { MemberRole } from "@prisma/client";

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
    return res.status(400).json({
      data: null,
      error: {
        message: error.message,
      },
    });
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

  const teamMember = await prisma.teamMember.findUnique({
    where: {
      id: parseInt(memberId),
    },
  });

  if (!teamMember) {
    throw new Error("Team member not found");
  }

  const schema = z.object({
    role: z.nativeEnum(MemberRole),
  });

  const { role } = schema.parse(req.body);

  const member = await prisma.teamMember.update({
    where: {
      id: parseInt(memberId),
    },
    data: {
      role,
    },
  });

  return res.status(200).json({
    data: member,
    error: null,
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

  const teamMember = await prisma.teamMember.findUnique({
    where: {
      id: parseInt(memberId),
    },
  });

  if (!teamMember) {
    throw new Error("Team member not found");
  }

  await prisma.teamMember.delete({
    where: {
      id: parseInt(memberId),
    },
  });

  return res.status(200).json({
    data: {
      status: "success",
    },
    error: null,
  });
};
