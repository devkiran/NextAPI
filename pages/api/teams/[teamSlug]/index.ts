import type { NextApiRequest, NextApiResponse } from "next";
import { getTeamWithMembers, isTeamAdmin, getTeam } from "@/lib/server/team";
import { getCurrentUser } from "@/lib/server/user";
import { prisma } from "@/lib/server/prisma";
import z from "zod";

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
    return res.status(400).json({
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

  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
  });

  const { name, slug } = schema.parse(req.body);

  const teamExists = await prisma.team.count({
    where: {
      slug,
      id: {
        not: team.id,
      },
    },
  });

  if (teamExists > 0) {
    throw new Error("A team with this slug already exists");
  }

  const updatedTeam = await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      name,
      slug,
    },
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

  await prisma.team.delete({
    where: {
      slug: teamSlug,
    },
  });

  return res.status(200).json({
    data: {},
  });
};
