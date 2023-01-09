import type { Team, User } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export const canInviteMember = async (user: User, team: Team) => {
  const teamMember = await prisma.teamMember.findFirstOrThrow({
    where: {
      teamId: team.id,
      userId: user.id,
    },
  });

  console.log(teamMember);

  if (teamMember.role === "ADMIN" || teamMember.role === "OWNER") {
    return true;
  }

  return false;
};
