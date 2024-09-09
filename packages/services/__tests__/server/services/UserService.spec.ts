import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { WizardStep } from "@app/utils/constants/wizard";

import { databaseService } from "../../utils/database.js";
import { UserService } from "../../../src/models/UserService.js";

describe("UserService", () => {
  let userService: UserService;

  beforeAll(async () => {
    userService = new UserService(databaseService);
  });

  beforeEach(async () => {
    await databaseService.begin();
    await databaseService.transaction().user.create({
      data: {
        id: "95818e89-2e0c-4749-9e3d-c44d71d22528",
        email: "pep.guardiola@mancity.com",
        fullName: "Pep Guardiola",
        wizardStep: WizardStep.COMPLETE,
      },
    });
  });

  afterEach(async () => {
    await databaseService.rollback();
  });

  describe("getById", () => {
    it("should return an existing user by ID", async () => {
      const result = await userService.getById(
        "95818e89-2e0c-4749-9e3d-c44d71d22528",
      );
      expect(result).not.toBeNull();
    });

    it("should return null if the user does not exist by ID", async () => {
      const result = await userService.getById(
        "820c0415-ed5d-4f6f-94ee-9fca18208863",
      );
      expect(result).toBeNull();
    });
  });

  describe("getByEmail", () => {
    it("should return an existing user by email", async () => {
      const result = await userService.getByEmail("pep.guardiola@mancity.com");
      expect(result).not.toBeNull();
    });

    it("should return null if the user does not exist by email", async () => {
      const result = await userService.getByEmail("leo.messi@mancity.com");
      expect(result).toBeNull();
    });
  });

  describe("getByEmailPasswordCombination", () => {
    it("should return an existing user if the email/password combination matches", () => {});

    it("should return null if the user does not exist by email", () => {});

    it("should return null if the password does not match", () => {});
  });
});
