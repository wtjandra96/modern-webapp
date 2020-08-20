const container = require("typedi").Container;

const request = require("supertest");
const express = require("express");

// Mock middlewares
const sinon = require("sinon");
const middlewares = require("../../../src/api/middlewares");
const logger = require("../../logger");
container.set("logger", logger);

sinon.stub(middlewares, "isAuth")
  .callsFake((req, res, next) => {
    req.userId = req.header("x-auth-token");
    next();
  });

const UserModel = require("../../../src/models/User");

const testdb = require("../../testdb");

const expressLoader = require("../../../src/loaders/express");

const { LOGIN_ROUTE, REGISTER_ROUTE, CHANGE_PASSWORD_ROUTE } = require("../../../src/api/routes/auth");

const app = express();

const testUser = {
  username: "testUser",
  password: "Aa!1abcd"
};

const testUser2 = {
  username: "testUser2",
  password: "Aa!1abcd"
};

const testRegister = {
  username: "testUser1",
  password: "Aa!1abcd"
};

let testUser1Id = null;
let testUser2Id = null;

describe("Testing auth route", () => {
  beforeAll(async () => {
    await testdb.connect();
    const tu1 = await UserModel.create(testUser);
    testUser1Id = tu1.id;
    const tu2 = await UserModel.create(testUser2);
    testUser2Id = tu2.id;
    container.set("UserModel", UserModel);
    await UserModel.ensureIndexes();
    expressLoader(app);
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe(`Testing ${CHANGE_PASSWORD_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(CHANGE_PASSWORD_ROUTE)
          .send({ oldPassword: 1, newPassword: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(CHANGE_PASSWORD_ROUTE).send({ oldPassword: "", newPassword: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(CHANGE_PASSWORD_ROUTE)
          .send({ oldPassword: null, newPassword: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Bad inputs", async () => {
        expect.assertions(2);
        const payload = await request(app).post(CHANGE_PASSWORD_ROUTE).send({ oldPassword: "#", newPassword: "########" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(1);
      });

      test("Input length too long", async () => {
        expect.assertions(2);
        const payload = await request(app).post(CHANGE_PASSWORD_ROUTE).send({
          oldPassword: "123456789012345678901",
          newPassword: "Aa!456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
        });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(1);
      });

      test("Input length too short", async () => {
        expect.assertions(2);
        const payload = await request(app).post(CHANGE_PASSWORD_ROUTE).send({ oldPassword: "a", newPassword: "Aa!1234" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(1);
      });
    });

    it("Should return status code 400 if old password is incorrect", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(CHANGE_PASSWORD_ROUTE)
        .set("x-auth-token", testUser1Id)
        .send({ oldPassword: "Aa!1abcde", newPassword: "Aa!1abcd" });

      const { status } = payload;
      expect(status).toStrictEqual(400);
    });

    it("Should return status code 201 with the correct old password", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(CHANGE_PASSWORD_ROUTE)
        .set("x-auth-token", testUser2Id)
        .send({ oldPassword: "Aa!1abcd", newPassword: "Aa!1abcdef" });

      const { status } = payload;
      expect(status).toStrictEqual(201);
    });
  });

  describe(`Testing ${LOGIN_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(LOGIN_ROUTE).send({ username: 1, password: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(LOGIN_ROUTE).send({ username: "", password: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(LOGIN_ROUTE)
          .send({ username: null, password: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });
    });

    it("Should return status code 400 if credentials are incorrect", async () => {
      expect.assertions(1);
      const payload = await request(app).post(LOGIN_ROUTE).send({ username: testUser.username, password: "123456" });

      const { status } = payload;
      expect(status).toStrictEqual(400);
    });

    it("Should return status code 200 with the correct login credentials", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(LOGIN_ROUTE)
        .send({ username: testUser.username, password: testUser.password });

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${REGISTER_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: 1, password: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "", password: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(REGISTER_ROUTE)
          .send({ username: null, password: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Bad inputs", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "#", password: "########" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Input length too long", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({
          username: "123456789012345678901",
          password: "Aa!456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
        });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Input length too short", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "", password: "Aa!1234" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(Object.keys(errors).length).toStrictEqual(2);
      });
    });

    it("Should return status code 400 if username already exists", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(REGISTER_ROUTE)
        .send({
          username: testUser.username,
          password: testUser.password
        });

      const { status } = payload;
      expect(status).toStrictEqual(400);
    });

    it("Should return status code 201 given correct inputs and username does not exist yet", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(REGISTER_ROUTE)
        .send({ username: testRegister.username, password: testRegister.password });

      const { status } = payload;
      expect(status).toStrictEqual(201);
    });
  });
});
