import { type NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export const getExceptionMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "An unknown error occurred";
};

export const getExceptionStatusCode = (error: unknown) => {
  return error instanceof ApiError ? error.statusCode : 500;
};

export const sendApiError = (res: NextApiResponse, error: unknown) => {
  const statusCode = getExceptionStatusCode(error);
  const message = getExceptionMessage(error);

  return res.status(statusCode).json({
    error: {
      message,
    },
  });
};
