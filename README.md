# Headless SaaS API

Create your next SaaS app with ease using the Headless SaaS API.

The ultimate solution for developers looking to create a fully-functional SaaS application.

Never write boilerplate backend code again and focus on what matters most: building your SaaS UI to attract and retain customers.

It is built on top of [Next.js](https://nextjs.org/) API routes and uses [Prisma](https://www.prisma.io/) as the ORM.

## API routes

| Method | Path             | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | /api/auth/signup | Sign up a new user       |
| POST   | /api/auth/signin | Sign in an existing user |
| POST   | /api/teams       | Create a new team        |
| GET    | /api/teams       | Get all teams for user   |
| GET    | /api/teams/:slug | Get a team               |
| DELETE | /api/teams/:slug | Delete a team            |
| POST   | /api/invites     | Create a new invite      |
