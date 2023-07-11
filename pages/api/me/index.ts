import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/modules/common/server/prisma";
import { getCurrentUser } from "@/modules/common/server/auth";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        await handleGET(req, res);
        break;
      case "PUT":
        await handlePUT(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["GET", "PUT"]);
    }
  } catch (error: any) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
}

// Get current user
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const currentUser = await getCurrentUser(req);

  res.status(200).json({
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

  res.status(200).json({
    data: updatedUser,
  });
};
