import { test, expect } from "@playwright/test";
import { prisma } from "@/modules/common/server/prisma";

const fakeUser = {
  email: "kiran@example.com",
  password: "password",
  firstName: "Kiran",
  lastName: "K",
};

test.beforeAll(async ({ request }) => {
  await prisma.user.delete({
    where: {
      email: fakeUser.email,
    },
  });
});

test("should create a new user", async ({ request }) => {
  const newUser = await request.post(`/api/auth/signup`, {
    data: fakeUser,
  });

  expect(newUser.ok()).toBeTruthy();
  expect(await newUser.json()).toMatchObject({
    data: {
      id: expect.any(Number),
      email: fakeUser.email,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
    },
  });
});
