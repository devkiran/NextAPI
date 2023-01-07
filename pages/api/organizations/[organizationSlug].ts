import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { addOrganizationMember } from "@/lib/server/organization";
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
      default:
        res.setHeader("Allow", "GET");
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

// Get the details of an organization
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { organizationSlug } = req.query as { organizationSlug: string };

  const currentUser = await getCurrentUser(req);

  const organization = await prisma.organization.findUnique({
    where: {
      slug: organizationSlug,
    },
    include: {
      members: {
        include: {
          user: true,
        },
        where: {
          userId: currentUser.id,
        },
      },
    },
  });

  return res.status(200).json({
    data: organization,
    error: null,
  });
};
