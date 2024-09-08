import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import {
  database,
  databaseService,
  clearDatabase,
} from "__tests__/utils/database.js";
import { UserService } from "@app/services/models/UserService";
import { WizardStep } from "@app/utils/constants/wizard";

// FIXME: Move this into @app/services instead
// FIXME: DB tests should use a transaction and roll back instead of writing to DB
describe("UserService", () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService(databaseService);
  });

  beforeEach(async () => {
    await database.user.create({
      data: {
        id: "95818e89-2e0c-4749-9e3d-c44d71d22528",
        email: "pep.guardiola@mancity.com",
        fullName: "Pep Guardiola",
        wizardStep: WizardStep.COMPLETE,
      },
    });
  });

  afterEach(async () => {
    await clearDatabase();
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
