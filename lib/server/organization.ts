import { prisma } from "@/lib/prisma";

type Role = "admin" | "member";

export const addOrganizationMember = async (params: {
  organizationId: number;
  userId: number;
  role: Role;
}) => {
  const { organizationId, userId, role } = params;

  return await prisma.organizationMember.create({
    data: {
      organizationId,
      userId,
      role,
    },
  });
};

export const getOrganizationWithMembers = async (slug: string) => {
  return await prisma.organization.findUniqueOrThrow({
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
