import { test, expect } from "@playwright/test";
import { prisma } from "@/modules/common/server/prisma";
import { fakeUser } from "./lib";

test.afterAll(async () => {
  await prisma.user.delete({
    where: {
      email: fakeUser.email,
    },
  });
});

test("should create a new user", async ({ request }) => {
  const signup = await request.post(`/api/auth/signup`, {
    data: fakeUser,
  });

  expect(signup.ok()).toBeTruthy();
  expect(await signup.json()).toMatchObject({
    data: {
      id: expect.any(Number),
      email: fakeUser.email,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
    },
  });
});

test("should login with the new user", async ({ request }) => {
  const signin = await request.post(`/api/auth/signin`, {
    data: {
      email: fakeUser.email,
      password: fakeUser.password,
    },
  });

  expect(signin.ok()).toBeTruthy();
  expect(await signin.json()).toMatchObject({
    data: {
      session: {
        access_token: expect.any(String),
        token_type: "bearer",
        expires_in: 3600,
      },
      user: {
        id: expect.any(String),
        email: fakeUser.email,
        role: "authenticated",
      },
    },
  });
});

test("should get the current user", async ({ request }) => {
  const signin = await request.post(`/api/auth/signin`, {
    data: {
      email: fakeUser.email,
      password: fakeUser.password,
    },
  });

  const { data } = await signin.json();

  const me = await request.get(`/api/me`, {
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
    },
  });

  expect(me.ok()).toBeTruthy();
  expect(await me.json()).toMatchObject({
    data: {
      id: expect.any(Number),
      email: fakeUser.email,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});
