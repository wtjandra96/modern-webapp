const container = require("typedi").Container;
const request = require("supertest");

const expressLoader = require("../../../src/loaders/express");
const UserModel = require("../../../src/models/User");
const logger = require("../../logger");

const testdb = require("../../testdb");
const { getApp } = require("../../../src/app");

const { FULL_LOGIN_ROUTE, FULL_REGISTER_ROUTE } = require("../../../src/api/routes/auth");

const REGISTER_ROUTE = `/${FULL_REGISTER_ROUTE.split(" ")[1]}`;
const LOGIN_ROUTE = `/${FULL_LOGIN_ROUTE.split(" ")[1]}`;

const app = getApp();

const testUser = {
  username: "testUser",
  password: "Aa!1abcd"
};

const testRegister = {
  username: "testUser1",
  password: "Aa!1abcd"
};

describe("Testing auth route", () => {
  beforeAll(async () => {
    await testdb.connect();
    await UserModel.create(testUser);
    expressLoader(app);
    container.set("UserModel", UserModel);
    container.set("logger", logger);
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe(`Testing ${FULL_LOGIN_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(LOGIN_ROUTE).send({ username: 1, password: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(LOGIN_ROUTE).send({ username: "", password: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(LOGIN_ROUTE)
          .send({ username: null, password: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
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

  describe(`Testing ${FULL_REGISTER_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: 1, password: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "", password: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(REGISTER_ROUTE)
          .send({ username: null, password: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Bad inputs", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "#", password: "########" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(6);
      });

      test("Input length too long", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({
          username: "123456789012345678901",
          password: "Aa!456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
        });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Input length too short", async () => {
        expect.assertions(2);
        const payload = await request(app).post(REGISTER_ROUTE).send({ username: "", password: "Aa!1234" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
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
