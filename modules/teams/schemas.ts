import z from "zod";
import { MemberRole } from "@prisma/client";

export const createTeamSchema = z.object({
  name: z.string().min(1, {
    message: "Team name is required",
  }),
  slug: z.string().min(1, {
    message: "Team slug is required",
  }),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1, {
    message: "Team name is required",
  }),
  slug: z.string().min(1, {
    message: "Team slug is required",
  }),
});

export const updateTeamMemberSchema = z.object({
  role: z.nativeEnum(MemberRole),
});
