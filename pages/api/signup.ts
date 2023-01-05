import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schemaUser = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePOST(req, res);
    default:
      res.setHeader("Allow", "POST");
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Create a new user account
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = schemaUser.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      data: null,
      error: response.error.format(),
    });
  }

  const { email, firstName, lastName, password } = response.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: response.data.email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      data: null,
      error: {
        message: "An user with this email already exists.",
      },
    });
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: await hashPassword(password),
    },
  });

  return res.status(200).json({
    data: newUser,
    error: null,
  });
};
