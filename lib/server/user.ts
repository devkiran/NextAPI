import { prisma } from "./prisma";
import type { NextApiRequest } from "next";
import { getSupabaseUser } from "../supabase";

// Get the current user from the request
export const getCurrentUser = async (req: NextApiRequest) => {
  const { id } = await getSupabaseUser(req);

  return await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
};
