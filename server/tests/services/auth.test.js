const container = require("typedi").Container;
const AuthService = require("../../src/services/auth");
const ServiceError = require("../../src/utils/errors/serviceError");
const MongoError = require("../../src/utils/errors/mongoError");
const UserModel = require("../../src/models/User");

const testdb = require("../testdb");

const inavlidUserId = "5e868964c037680d183cd5a4";
let testUserId = null;

describe("Testing AuthService", () => {
  beforeAll(async () => {
    await testdb.connect();
    const userModel = {
      name: "UserModel",
      model: UserModel
    };
    container.set(userModel.name, userModel.model);
    await UserModel.ensureIndexes();
    const userRecord = await UserModel.create({
      username: "testUser",
      password: "Aa12345!"
    });
    testUserId = userRecord.id;
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe("AuthService.register(username, password)", () => {
    it("Should create a new User with valid credentials", async () => {
      expect.assertions(1);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.register(
        "test1",
        "password1"
      );
      const { message } = payload;
      expect(message).toBeDefined();
    });

    it("Should not allow duplicate usernames", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.register("test1", "password1");
      } catch (err) {
        expect(err).toBeInstanceOf(MongoError);
        const { errors } = err;
        expect(Object.keys(errors).length).toStrictEqual(1);
      }
    });
  });

  describe("AuthService.changePassword(oldPassword, newPassword)", () => {
    it("Should not accept incorrect password", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.changePassword(testUserId, "incorrect", "Aa12345678!");
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        const { errors } = err;
        expect(Object.keys(errors).length).toStrictEqual(1);
      }
    });

    it("Should not accept a non existing user", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.changePassword(inavlidUserId, "test2", "incorrect");
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        const { errors } = err;
        expect(Object.keys(errors).length).toStrictEqual(1);
      }
    });

    it("Should allow changing password with valid credentials", async () => {
      expect.assertions(4);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.changePassword(
        testUserId,
        "Aa12345!",
        "Aa12345678!"
      );
      const { message } = payload;
      expect(message).toBeDefined();
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
        const { errors } = err;
        expect(Object.keys(errors).length).toStrictEqual(1);
      }
    });

    it("Should not accept a non existing user", async () => {
      expect.assertions(2);

      const authServiceInstance = container.get(AuthService);
      try {
        await authServiceInstance.login("test2", "incorrect");
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        const { errors } = err;
        expect(Object.keys(errors).length).toStrictEqual(1);
      }
    });

    it("Should login User with valid credentials", async () => {
      expect.assertions(4);

      const authServiceInstance = container.get(AuthService);
      const payload = await authServiceInstance.login(
        "test1",
        "password1"
      );
      const { message, token, user } = payload;
      expect(message).toBeDefined();
      expect(token).toBeDefined();
      expect(user).toBeDefined();
      expect(user.username).toStrictEqual("test1");
    });
  });
});
