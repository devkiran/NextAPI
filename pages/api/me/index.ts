import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/server/prisma";
import { getCurrentUser } from "@/lib/server/user";

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
      default:
        res.setHeader("Allow", "GET, PUT");
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

// Get current user
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const currentUser = await getCurrentUser(req);

  return res.status(200).json({
    data: currentUser,
  });
};

// Update current user
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const currentUser = await getCurrentUser(req);

  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });

  const { firstName, lastName } = schema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      firstName,
      lastName,
    },
  });

  return res.status(200).json({
    data: updatedUser,
  });
};
