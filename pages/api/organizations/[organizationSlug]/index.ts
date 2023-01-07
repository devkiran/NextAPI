import type { NextApiRequest, NextApiResponse } from "next";
import { getOrganizationWithMembers } from "@/lib/server/organization";
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

// Get the details of an organization
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { organizationSlug } = req.query as { organizationSlug: string };

  const currentUser = await getCurrentUser(req);
  const organization = await getOrganizationWithMembers(organizationSlug);

  const isMember = organization.members.some(
    (member) => member.userId === currentUser.id
  );

  if (!isMember) {
    throw new Error("You are not a member of this organization");
  }

  return res.status(200).json({
    data: organization,
    error: null,
  });
};

// Delete the organization
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { organizationSlug } = req.query as { organizationSlug: string };

  const currentUser = await getCurrentUser(req);
  const organization = await getOrganizationWithMembers(organizationSlug);

  const isAdmin = organization.members.some(
    (member) => member.userId === currentUser.id && member.role === "admin"
  );

  if (!isAdmin) {
    throw new Error("You are not an admin of this organization");
  }

  return res.status(200).json({
    data: {},
    error: null,
  });
};
