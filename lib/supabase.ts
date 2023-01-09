import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest } from "next";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or key");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Get the Supabase user from the request
export const getSupabaseUser = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error("Unauthorized");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    id: user.user_metadata.appUserId,
    supabaseId: user.id,
    email: user.email,
  };
};
