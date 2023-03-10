import { prisma } from "@/modules/common/server/prisma";
import { MemberRole, Team, User } from "@prisma/client";
import { CreateTeamParams, UpdateTeamParams } from "../types";
import { addTeamMember } from "./member";

export const getTeamWithMembers = async (slug: string) => {
  const team = await prisma.team.findUniqueOrThrow({
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

  const teamWithMembers = team.members.map(({ user, role }) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role,
  }));

  return {
    ...team,
    members: teamWithMembers,
  };
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

// Create a new team
export const createTeam = async (params: CreateTeamParams) => {
  const { name, slug, user } = params;

  const existingTeam = await prisma.team.count({
    where: {
      slug,
    },
  });

  if (existingTeam > 0) {
    throw new Error("Team already exists");
  }

  const newTeam = await prisma.team.create({
    data: {
      name,
      slug,
    },
  });

  await addTeamMember({
    teamId: newTeam.id,
    userId: user.id,
    role: "OWNER",
  });

  return newTeam;
};

// Get all teams for the current user
export const getTeams = async (user: User) => {
  return await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });
};

// Update team details
export const updateTeam = async (params: UpdateTeamParams) => {
  const { name, slug, team } = params;

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

  return await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      name,
      slug,
    },
  });
};

// Delete a team
export const deleteTeam = async (team: Team) => {
  await prisma.team.delete({
    where: {
      slug: team.slug,
    },
  });
};
