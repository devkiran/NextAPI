import { test, expect } from "@playwright/test";

test.beforeAll(async ({ request }) => {
  await request.delete(`/api/teams/acme`);
});

test("should create a new team", async ({ request }) => {
  const newTeam = await request.post(`/api/teams`, {
    data: {
      name: "Acme",
      slug: "acme",
    },
  });

  expect(newTeam.ok()).toBeTruthy();
  expect(await newTeam.json()).toMatchObject({
    data: {
      name: "Acme",
      slug: "acme",
    },
  });

  const team = await request.get(`/api/teams/acme`);

  expect(team.ok()).toBeTruthy();
  expect(await team.json()).toMatchObject({
    data: {
      name: "Acme",
      slug: "acme",
    },
  });
});

test("should update a team", async ({ request }) => {
  const updatedTeam = await request.put(`/api/teams/acme`, {
    data: {
      name: "Acme Updated",
      slug: "acme",
    },
  });

  expect(updatedTeam.ok()).toBeTruthy();
  expect(await updatedTeam.json()).toMatchObject({
    data: {
      name: "Acme Updated",
      slug: "acme",
    },
  });

  const team = await request.get(`/api/teams/acme`);

  expect(team.ok()).toBeTruthy();
  expect(await team.json()).toMatchObject({
    data: {
      name: "Acme Updated",
      slug: "acme",
    },
  });
});

test("should get all teams for user", async ({ request }) => {
  const teams = await request.get(`/api/teams`);

  expect(teams.ok()).toBeTruthy();
  expect(await teams.json()).toMatchObject({
    data: [
      {
        name: "Acme Updated",
        slug: "acme",
      },
    ],
  });
});

test("should delete a team", async ({ request }) => {
  const deletedTeam = await request.delete(`/api/teams/acme`);

  expect(deletedTeam.ok()).toBeTruthy();
  expect(await deletedTeam.json()).toMatchObject({
    data: {},
  });

  const team = await request.get(`/api/teams/acme`);

  expect(team.ok()).toBeFalsy();
  expect(await team.json()).toMatchObject({
    error: {
      message: "No Team found",
    },
  });
});
