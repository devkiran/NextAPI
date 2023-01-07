import type { NextApiResponse } from "next";

// export const sendError = (res: NextApiResponse, error: any, status = 400) => {
//   return res.status(status).json({
//     data: null,
//     error: {
//       message: error.message,
//     },
//   });
// };

export const sendSuccess = (
  res: NextApiResponse,
  status: number,
  data: any
) => {
  return res.status(status).json({
    data,
    error: null,
  });
};
