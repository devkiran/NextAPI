import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import WelcomeEmail from "emails/welcome";
import type { User } from "@prisma/client";
import env from "../env";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

const { app, smtp } = env;

// Send email using nodemailer
export const sendEmail = async (data: EmailData) => {
  if (app.sendEmails === false) {
    return console.info("Emails are disabled. Skipping sending email.", data);
  }

  if (!smtp.host || !smtp.port || !smtp.user || !smtp.password || !smtp.from) {
    return console.error(
      "SMTP credentials are missing. Skipping sending email.",
      data
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: false,
    auth: {
      user: smtp.user,
      pass: smtp.password,
    },
  });

  return await transporter.sendMail({
    from: smtp.from,
    ...data,
  });
};

// Send welcome email to new user
export const sendWelcomeEmail = async ({ user }: { user: User }) => {
  const emailHtml = render(<WelcomeEmail />);

  await sendEmail({
    to: user.email,
    subject: `Welcome to ${app.name}`,
    html: emailHtml,
  });
};
