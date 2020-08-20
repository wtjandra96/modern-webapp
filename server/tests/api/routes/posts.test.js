const container = require("typedi").Container;
const logger = require("../../logger");
container.set("logger", logger);

const request = require("supertest");
const express = require("express");

// Mock middlewares
const sinon = require("sinon");
const middlewares = require("../../../src/api/middlewares");

sinon.stub(middlewares, "isAuth")
  .callsFake((req, res, next) => {
    req.userId = req.header("x-auth-token");
    next();
  });

const CategoryModel = require("../../../src/models/Category");
const LabelModel = require("../../../src/models/Label");
const PostModel = require("../../../src/models/Post");

const testdb = require("../../testdb");

const expressLoader = require("../../../src/loaders/express");

const {
  CREATE_POST_ROUTE,
  GET_POSTS_ROUTE,
  DELETE_POST_ROUTE,
  EDIT_POST_ROUTE
} = require("../../../src/api/routes/posts");

const testUserId = "5e868964c037680d183dd5a3";
const nonAuthorizedUserId = "5e868964c037680d183cd5a4";
const testLabelId = "5e868964c037680d183cd5a6";

const app = express();

describe("Testing posts route", () => {
  let testPostId = null;
  let testCategoryId = null;
  beforeAll(async () => {
    container.set("LabelModel", LabelModel);
    container.set("CategoryModel", CategoryModel);
    container.set("PostModel", PostModel);
    await testdb.connect();
    const category = await CategoryModel.create({
      owner: testUserId,
      name: "Category"
    });
    testCategoryId = category.id;
    const post = await PostModel.create({
      owner: testUserId,
      category: testCategoryId,
      title: "Title",
      url: "url"
    });

    post.labels.push(testLabelId);
    await post.save();
    testPostId = post.id;
    expressLoader(app);
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe(`Testing ${CREATE_POST_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Incorrect param types", async () => {
        expect.assertions(1);

        const requestBody = {
          categoryId: {},
          title: {},
          url: {},
          postAttributes: {
            originalDate: {},
            imgSrc: {}
          }
        };
        const payload = await request(app).post(CREATE_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("Missing params", async () => {
        expect.assertions(1);

        const requestBody = {

        };
        const payload = await request(app).post(CREATE_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(3);
      });

      test("Empty string", async () => {
        expect.assertions(1);

        const requestBody = {
          categoryId: "",
          title: "",
          url: "",
          postAttributes: {
            originalDate: "",
            imgSrc: ""
          }
        };
        const payload = await request(app).post(CREATE_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("postAttributes not an object", async () => {
        expect.assertions(1);

        const requestBody = {
          categoryId: "",
          title: "",
          url: "",
          postAttributes: "12345"
        };
        const payload = await request(app).post(CREATE_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("categoryId not an ObjectId", async () => {
        expect.assertions(1);

        const requestBody = {
          categoryId: "12345",
          title: "123",
          url: "123"
        };
        const payload = await request(app).post(CREATE_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(1);
      });
    });

    it("Should return status code 201 given valid inputs", async () => {
      expect.assertions(1);

      const requestBody = {
        categoryId: testCategoryId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(CREATE_POST_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(201);
    });

    it("Should return status code 404 if Category cannot be found", async () => {
      expect.assertions(1);

      const requestBody = {
        categoryId: testUserId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(CREATE_POST_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });

    it("Should return status code 404 if an unauthorized User tries to create a Post", async () => {
      expect.assertions(1);

      const requestBody = {
        categoryId: nonAuthorizedUserId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(CREATE_POST_ROUTE)
        .set("x-auth-token", testCategoryId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });
  });

  describe(`Testing ${GET_POSTS_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Incorrect param types", async () => {
        expect.assertions(1);

        const requestQuery = {
          categoryId: "a",
          labelIds: [{ a: "b" }]
        };
        const payload = await request(app).get(GET_POSTS_ROUTE)
          .set("x-auth-token", testUserId)
          .query(requestQuery);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("Not objectId", async () => {
        expect.assertions(1);

        const requestQuery = {
          categoryId: "12345",
          labelIds: ["12345"]
        };
        const payload = await request(app).get(GET_POSTS_ROUTE)
          .set("x-auth-token", testUserId)
          .query(requestQuery);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(2);
      });

      test("labelIds not array", async () => {
        expect.assertions(1);

        const requestQuery = {
          categoryId: "12345",
          labelIds: { a: "b" }
        };
        const payload = await request(app).get(GET_POSTS_ROUTE)
          .set("x-auth-token", testUserId)
          .query(requestQuery);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(2);
      });
    });

    it("Should return 200 even if an unauthorized User makes a request", async () => {
      expect.assertions(1);

      const requestQuery = {
        categoryId: testCategoryId
      };
      const payload = await request(app)
        .get(GET_POSTS_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .query(requestQuery);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return 200 if an authorized User makes a request", async () => {
      expect.assertions(1);

      const requestQuery = {
        categoryId: testCategoryId
      };
      const payload = await request(app)
        .get(GET_POSTS_ROUTE)
        .set("x-auth-token", testUserId)
        .query(requestQuery);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return 200 even if Category does not exist", async () => {
      expect.assertions(1);

      const requestQuery = {
        categoryId: testUserId
      };
      const payload = await request(app)
        .get(GET_POSTS_ROUTE)
        .set("x-auth-token", testUserId)
        .query(requestQuery);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${EDIT_POST_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Incorrect param types", async () => {
        expect.assertions(1);

        const requestBody = {
          postId: {},
          title: {},
          url: {},
          postAttributes: {
            originalDate: {},
            imgSrc: {}
          }
        };
        const payload = await request(app).post(EDIT_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("Missing params", async () => {
        expect.assertions(1);

        const requestBody = {

        };
        const payload = await request(app).post(EDIT_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(3);
      });

      test("Empty string", async () => {
        expect.assertions(1);

        const requestBody = {
          postId: "",
          title: "",
          url: "",
          postAttributes: {
            originalDate: "",
            imgSrc: ""
          }
        };
        const payload = await request(app).post(EDIT_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("postAttributes not an object", async () => {
        expect.assertions(1);

        const requestBody = {
          postId: "",
          title: "",
          url: "",
          postAttributes: "12345"
        };
        const payload = await request(app).post(EDIT_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(4);
      });

      test("postId not an ObjectId", async () => {
        expect.assertions(1);

        const requestBody = {
          postId: "12345",
          title: "123",
          url: "123"
        };
        const payload = await request(app).post(EDIT_POST_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(1);
      });
    });

    it("Should return status code 200 given valid inputs", async () => {
      expect.assertions(1);

      const requestBody = {
        postId: testPostId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(EDIT_POST_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 404 if Post cannot be found", async () => {
      expect.assertions(1);

      const requestBody = {
        postId: testUserId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(EDIT_POST_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });

    it("Should return status code 404 if an unauthorized User tries to edit a Post", async () => {
      expect.assertions(1);

      const requestBody = {
        postId: testPostId,
        title: "123",
        url: "123"
      };
      const payload = await request(app)
        .post(EDIT_POST_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });
  });

  describe(`Testing ${DELETE_POST_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Empty string", async () => {
        expect.assertions(2);

        const requestParam = {
          postId: ""
        };
        const payload = await request(app)
          .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
          .set("x-auth-token", testUserId);

        const { status } = payload;
        expect(status).toStrictEqual(404);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(1);
      });

      test("null", async () => {
        expect.assertions(1);

        const requestParam = {
          postId: null
        };
        const payload = await request(app)
          .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(1);
      });

      test("postId not ObjectId", async () => {
        expect.assertions(1);

        const requestParam = {
          postId: "12345"
        };
        const payload = await request(app)
          .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(Object.keys(errors).length).toStrictEqual(1);
      });
    });

    it("Should return 200 even if an unauthorized User tries to delete Post", async () => {
      expect.assertions(1);

      const requestParam = {
        postId: testPostId
      };
      const payload = await request(app)
        .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
        .set("x-auth-token", nonAuthorizedUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return 200 even if Post does not exist", async () => {
      expect.assertions(1);

      const requestParam = {
        postId: testCategoryId
      };
      const payload = await request(app)
        .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
        .set("x-auth-token", testUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return 200 if an authorized User makes a request to delete Post", async () => {
      expect.assertions(1);

      const requestParam = {
        postId: testPostId
      };
      const payload = await request(app)
        .delete(`${DELETE_POST_ROUTE}/${requestParam.postId}`)
        .set("x-auth-token", testUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });
});
