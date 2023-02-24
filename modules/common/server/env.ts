const env = {
  app: {
    name: "My App",
    url: process.env.APP_URL || "http://localhost:3000",
    sendEmails: process.env.SEND_EMAILS === "true",
  },

  smtp: {
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525"),
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
    from: process.env.SMTP_FROM || "no-reply@saas-api.dev",
  },
};

export default env;
