const container = require("typedi").Container;
const AuthService = require("../../src/services/auth");
const ServiceError = require("../../src/utils/errors/serviceError");
const MongoError = require("../../src/utils/errors/mongoError");

describe("Testing AuthService", () => {
  beforeAll(() => {
    const mockUserModel = {
      create: (user) => {
        if (user.username === "test1") {
          throw new MongoError(409, [
            { msg: "Username already exists" }
          ]);
        }
      },
      findOne: (user) => {
        if (user.username === "test1") {
          return {
            ...user,
            password: "password1",
            _id: "mock-user-id",
            comparePassword: (password1, password2) => {
              if (password1 === password2) {
                return true;
              }

              return false;
            }
          };
        }
        return null;
      }
    };
    container.set("userModel", mockUserModel);
  });

  describe("AuthService.register(username, password)", () => {
    it("Should not allow duplicate usernames", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.register("test1", "password1");
      } catch (err) {
        expect(err).toBeInstanceOf(MongoError);
        expect(err.errors.length).toBe(1);
      }
    });

    it("Should create a new User with valid credentials", async () => {
      expect.assertions(1);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.register(
        "test2",
        "password1"
      );
      const { msg } = payload;
      expect(msg).toBeDefined();
    });
  });

  describe("AuthService.login(username, password)", () => {
    it("Should not accept incorrect password", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.login("test1", "incorrect");
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.errors.length).toBe(1);
      }
    });

    it("Should not accept a non existing user", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.login("test2", "incorrect");
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.errors.length).toBe(1);
      }
    });

    it("Should login User with valid credentials", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.login(
        "test1",
        "password1"
      );
      const { msg, token } = payload;
      expect(msg).toBeDefined();
      expect(token).toBeDefined();
    });
  });
});
