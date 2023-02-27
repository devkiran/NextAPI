import { faker } from "@faker-js/faker";

export const fakeUser = {
  email: faker.internet.email().toLowerCase(),
  firstName: "Dwayne",
  lastName: "Johnson",
  password: "password",
};

export const fakeTeam = {
  name: "Acme",
  slug: "acme",
};
