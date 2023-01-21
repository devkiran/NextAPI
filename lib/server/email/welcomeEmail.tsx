import type { User } from "@prisma/client";
import { sendEmail } from "./sendEmail";
import app from "../app";
import { render } from "@react-email/render";
import WelcomeEmail from "emails/welcome";

export const welcomeEmail = async ({ user }: { user: User }) => {
  const emailHtml = render(<WelcomeEmail />);

  await sendEmail({
    to: user.email,
    subject: `Welcome to ${app.name}`,
    html: emailHtml,
  });
};
