import { prisma } from "@/lib/server/prisma";
import { MemberRole, Team, User } from "@prisma/client";
import type { Role } from "../types";

export const addTeamMember = async (params: {
  teamId: number;
  userId: number;
  role: Role;
}) => {
  const { teamId, userId, role } = params;

  return await prisma.teamMember.create({
    data: {
      teamId,
      userId,
      role,
    },
  });
};

export const getTeamWithMembers = async (slug: string) => {
  return await prisma.team.findUniqueOrThrow({
    where: {
      slug,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getTeam = async (slug: string) => {
  return await prisma.team.findUniqueOrThrow({
    where: {
      slug,
    },
  });
};

export const isTeamAdmin = async (user: User, team: Team) => {
  const membership = await prisma.teamMember.findFirstOrThrow({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  return (
    membership.role === MemberRole.OWNER || membership.role === MemberRole.ADMIN
  );
};

export const isTeamOwner = async (user: User, team: Team) => {
  const membership = await prisma.teamMember.findFirstOrThrow({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  return membership.role === MemberRole.OWNER;
};

export const isTeamMember = async (user: User, team: Team) => {
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  return membership !== null;
};
