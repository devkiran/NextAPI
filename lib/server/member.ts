import { prisma } from "@/lib/server/prisma";
import type { Role } from "../types";

type AddTeamMemberParams = {
  teamId: number;
  userId: number;
  role: Role;
};

type RemoveTeamMemberParams = {
  memberId: string;
};

// Add a user to a team with a specific role
export const addTeamMember = async (params: AddTeamMemberParams) => {
  const { teamId, userId, role } = params;

  return await prisma.teamMember.create({
    data: {
      teamId,
      userId,
      role,
    },
  });
};

// Update a team member's role
export const updateTeamMember = async (params: {
  memberId: string;
  role: Role;
}) => {
  const { memberId, role } = params;

  const teamMember = await prisma.teamMember.findUnique({
    where: {
      id: parseInt(memberId),
    },
  });

  if (!teamMember) {
    throw new Error("Team member not found");
  }

  return await prisma.teamMember.update({
    where: {
      id: parseInt(memberId),
    },
    data: {
      role,
    },
  });
};

// Remove a user from a team
export const removeTeamMember = async (params: RemoveTeamMemberParams) => {
  const { memberId } = params;

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
};
