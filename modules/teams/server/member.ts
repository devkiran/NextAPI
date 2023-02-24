import { Team } from "@prisma/client";
import { prisma } from "@/modules/common/server/prisma";
import { AddTeamMemberParams, RemoveTeamMemberParams, Role } from "../types";

// Get team members
export const getTeamMembers = async (team: Team) => {
  const members = await prisma.teamMember.findMany({
    where: {
      teamId: team.id,
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      user: true,
    },
  });

  return members.map(({ user, role }) => ({
    id: user.id,
    role,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
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
