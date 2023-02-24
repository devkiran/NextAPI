import z from "zod";
import { Team, User } from "@prisma/client";
import { createTeamSchema, updateTeamSchema } from "./schemas";

export type CreateTeamParams = z.infer<typeof createTeamSchema> & {
  user: User;
};

export type UpdateTeamParams = z.infer<typeof updateTeamSchema> & {
  team: Team;
};

export type AddTeamMemberParams = {
  teamId: number;
  userId: number;
  role: Role;
};

export type RemoveTeamMemberParams = {
  memberId: string;
};

export const roles = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export type Role = keyof typeof roles;
