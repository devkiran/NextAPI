# Headless SaaS API

This is a headless SaaS API that can be used to create a SaaS application.

It is built on top of [Next.js](https://nextjs.org/) API routes and uses [Prisma](https://www.prisma.io/) as the ORM.

## API routes

| Method | Path             | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | /api/auth/signup | Sign up a new user       |
| POST   | /api/auth/signin | Sign in an existing user |
| POST   | /api/teams       | Create a new team        |
| GET    | /api/teams       | Get all teams for user   |
| GET    | /api/teams/:id   | Get a team by id         |
| DELETE | /api/teams/:id   | Delete a team by id      |
