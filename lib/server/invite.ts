import { prisma } from "@/lib/server/prisma";
import { addTeamMember } from "./member";

// Accept the invitation
export const acceptInvitation = async (token: string) => {
  const invitation = await prisma.invitation.findUniqueOrThrow({
    where: {
      token,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: invitation.email,
    },
  });

  if (!user) {
    throw new Error(
      "An account with this email does not exist. Please sign up before accepting the invitation."
    );
  }

  const team = await prisma.team.findUniqueOrThrow({
    where: {
      id: invitation.teamId,
    },
  });

  await addTeamMember({
    teamId: team.id,
    userId: user.id,
    role: invitation.role,
  });

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });
};

// Decline the invitation
export const declineInvitation = async (token: string) => {
  const invitation = await prisma.invitation.findUniqueOrThrow({
    where: {
      token,
    },
  });

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });
};
