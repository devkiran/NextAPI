import { test, expect } from "@playwright/test";
import { prisma } from "@/modules/common/server/prisma";
import { fakeUser, fakeTeam } from "./lib";

let apiContext: any;

test.beforeAll(async ({ request, playwright }) => {
  await request.post(`/api/auth/signup`, {
    data: fakeUser,
  });

  const signin = await request.post(`/api/auth/signin`, {
    data: {
      email: fakeUser.email,
      password: fakeUser.password,
    },
  });

  expect(signin.ok()).toBeTruthy();

  const { data } = await signin.json();

  apiContext = await playwright.request.newContext({
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: {
      Authorization: `Bearer ${data.session.access_token}`,
      accept: "application/json",
    },
  });
});

test.afterAll(async () => {
  await apiContext.delete(`/api/teams/${fakeTeam.slug}`);

  await prisma.user.delete({
    where: {
      email: fakeUser.email,
    },
  });

  await apiContext.dispose();
});

test("should create a new team", async () => {
  const newTeam = await apiContext.post(`/api/teams`, {
    data: fakeTeam,
  });

  expect(newTeam.ok()).toBeTruthy();
  expect(await newTeam.json()).toMatchObject({
    data: fakeTeam,
  });

  const team = await apiContext.get(`/api/teams/${fakeTeam.slug}`);

  const { data: teamCreated } = await team.json();

  expect(team.ok()).toBeTruthy();
  expect(teamCreated.name).toBe(fakeTeam.name);
  expect(teamCreated.slug).toBe(fakeTeam.slug);
  expect(teamCreated.members).toHaveLength(1);
  expect(teamCreated.members[0].email).toBe(fakeUser.email);
  expect(teamCreated.members[0].firstName).toBe(fakeUser.firstName);
  expect(teamCreated.members[0].lastName).toBe(fakeUser.lastName);
  expect(teamCreated.members[0].role).toBe("OWNER");
});

test("should update a team", async () => {
  const toUpdate = {
    name: "Acme Updated",
    slug: "acme",
  };

  const updatedTeam = await apiContext.put(`/api/teams/${fakeTeam.slug}`, {
    data: toUpdate,
  });

  expect(updatedTeam.ok()).toBeTruthy();
  expect(await updatedTeam.json()).toMatchObject({
    data: toUpdate,
  });

  const team = await apiContext.get(`/api/teams/${fakeTeam.slug}`);

  expect(team.ok()).toBeTruthy();
  expect(await team.json()).toMatchObject({
    data: toUpdate,
  });

  // Revert the update so that it doesn't affect other tests
  await apiContext.put(`/api/teams/${fakeTeam.slug}`, {
    data: fakeTeam,
  });
});

test("should get all teams for user", async () => {
  const teams = await apiContext.get(`/api/teams`);

  expect(teams.ok()).toBeTruthy();
  expect(await teams.json()).toMatchObject({
    data: [fakeTeam],
  });
});

test("should delete a team", async () => {
  const deletedTeam = await apiContext.delete(`/api/teams/${fakeTeam.slug}`);

  expect(deletedTeam.ok()).toBeTruthy();
  expect(await deletedTeam.json()).toMatchObject({
    data: {},
  });

  const team = await apiContext.get(`/api/teams/${fakeTeam.slug}`);

  expect(team.ok()).toBeFalsy();
  expect(await team.json()).toMatchObject({
    error: {
      message: "No Team found",
    },
  });
});
