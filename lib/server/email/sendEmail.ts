import nodemailer from "nodemailer";

const smtp = {
  host: "smtp.mailtrap.io",
  port: 2525,
  user: "e6ee50483e03a9",
  password: "815fff8950473f",
  from: "kiran@saas-api.dev",
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (data: EmailData) => {
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
