import { database, clearDatabase } from "__tests__/utils/database";
import { mockServerContext } from "__tests__/utils/mocks";
import { UserService } from "~/server/services/UserService.server";

describe("UserService", () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService(database, mockServerContext.loggerService);
  });

  beforeEach(async () => {
    await database.user.create({
      data: {
        id: "95818e89-2e0c-4749-9e3d-c44d71d22528",
        email: "pep.guardiola@mancity.com",
        fullName: "Pep Guardiola",
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
