import type { Team, User, Invitation } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export const canAccessTeam = async (user: User, team: Team) => {
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  if (!teamMember) {
    return false;
  }

  return true;
};

export const canCreateInvite = async (user: User, team: Team) => {
  if (!(await canAccessTeam(user, team))) {
    return false;
  }

  const teamMember = await prisma.teamMember.findFirstOrThrow({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  if (teamMember.role === "ADMIN" || teamMember.role === "OWNER") {
    return true;
  }

  return false;
};

export const canReadInvite = async (
  user: User,
  team: Team,
  invite: Invitation | null
) => {
  if (!(await canAccessTeam(user, team))) {
    return false;
  }

  const teamMember = await prisma.teamMember.findFirstOrThrow({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  if (invite && invite.teamId !== team.id) {
    return false;
  }

  if (teamMember.role === "ADMIN" || teamMember.role === "OWNER") {
    return true;
  }

  return false;
};

export const canDeleteInvite = async (
  user: User,
  team: Team,
  invite: Invitation
) => {
  return await canReadInvite(user, team, invite);
};
