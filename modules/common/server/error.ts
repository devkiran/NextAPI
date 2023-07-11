import type { NextApiResponse } from "next";
import { ZodError } from "zod";
import { ApiError } from "next/dist/server/api-utils";

export const getExceptionMessage = (error: unknown) => {
  if (error instanceof ZodError) {
    return error.issues[0].message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
};

export const getExceptionStatusCode = (error: unknown) => {
  if (error instanceof ZodError) {
    return 400;
  }

  if (error instanceof ApiError) {
    return error.statusCode;
  }

  return 500;
};

export const sendApiError = (res: NextApiResponse, error: unknown) => {
  const status = getExceptionStatusCode(error);
  const message = getExceptionMessage(error);

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

export const throwMethodNotAllowed = (
  res: NextApiResponse,
  method: string | undefined,
  allowed: string[]
) => {
  res.setHeader("Allow", allowed.join(", "));
  throw new Error(`Method ${method} Not Allowed`);
};
