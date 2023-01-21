# Headless SaaS API

Create your next SaaS app with ease using the Headless SaaS API.

The ultimate solution for developers looking to create a fully-functional SaaS application.

Never write boilerplate backend code again and focus on what matters most: building your SaaS UI to attract and retain customers.

It is built on top of [Next.js](https://nextjs.org/) API routes and uses [Prisma](https://www.prisma.io/) as the ORM.

## API routes

| Method | Path                               | Description              |
| ------ | ---------------------------------- | ------------------------ |
| POST   | /api/auth/signup                   | Sign up a new user       |
| POST   | /api/auth/signin                   | Sign in an existing user |
| POST   | /api/teams                         | Create a new team        |
| GET    | /api/teams                         | Get all teams for user   |
| GET    | /api/teams/:slug                   | Get a team               |
| DELETE | /api/teams/:slug                   | Delete a team            |
| PUT    | /api/teams/:slug                   | Update a team            |
| POST   | /api/teams/:slug/invites           | Create a new invite      |
| GET    | /api/teams/:slug/invites           | Get all invites for team |
| GET    | /api/teams/:slug/invites/:inviteId | Get an invite            |
| DELETE | /api/teams/:slug/invites/:inviteId | Delete an invite         |
| GET    | /api/teams/:slug/members           | Get all members for team |
| PUT    | /api/teams/:slug/members/:memberId | Update a member          |
| DELETE | /api/teams/:slug/members/:memberId | Delete a member          |
| GET    | /api/me                            | Get current user         |
| PUT    | /api/me                            | Update current user      |

## Emails are sent for the following events

- When a new user signs up
- When a new invite is created
- When a user is added to a team
- When a user is removed from a team
