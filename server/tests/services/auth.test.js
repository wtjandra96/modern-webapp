const container = require("typedi").Container;
const AuthService = require("../../src/services/auth");
const ServiceError = require("../../src/utils/errors/serviceError");
const MongoError = require("../../src/utils/errors/mongoError");
const UserModel = require("../../src/models/User");

const testdb = require("../testdb");

describe("Testing AuthService", () => {
  beforeAll(() => {
    testdb.connect();
    const userModel = {
      name: "UserModel",
      model: UserModel
    };
    container.set(userModel.name, userModel.model);
  });

  afterAll(() => {
    testdb.disconnect();
  });

  describe("AuthService.register(username, password)", () => {
    it("Should create a new User with valid credentials", async () => {
      expect.assertions(1);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.register(
        "test1",
        "password1"
      );
      const { msg } = payload;
      expect(msg).toBeDefined();
    });

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
