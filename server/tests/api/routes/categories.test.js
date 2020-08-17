const container = require("typedi").Container;
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
  CREATE_CATEGORY_ROUTE,
  CREATE_LABEL_ROUTE,
  GET_CATEGORIES_ROUTE,
  GET_LABELS_ROUTE,
  EDIT_CATEGORY_ROUTE,
  EDIT_LABEL_ROUTE,
  DELETE_CATEGORY_ROUTE,
  DELETE_LABEL_ROUTE
} = require("../../../src/api/routes/categories");

const testUserId = "5e868964c037680d183cd5a3";
const nonAuthorizedUserId = "5e868964c037680d183cd5a4";
const testCategoryName = "testCategory";
const dummyCategoryName = "dummyCategory";

const app = express();

describe("Testing categories route", () => {
  let testCategoryId = null;
  let testLabelId = null;
  beforeAll(async () => {
    container.set("CategoryModel", CategoryModel);
    container.set("LabelModel", LabelModel);
    container.set("PostModel", PostModel);
    await testdb.connect();
    await CategoryModel.ensureIndexes();
    const category = await CategoryModel.create({ owner: testUserId, name: dummyCategoryName });
    testCategoryId = category.id;
    const label = await LabelModel.create({
      owner: testUserId, category: testCategoryId, name: "Label", color: "#fff"
    });
    testLabelId = label.id;
    expressLoader(app);
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe(`Testing ${CREATE_CATEGORY_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(CREATE_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send({ name: 1 });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(1);
      });

      test("Empty string", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(CREATE_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send({ name: "" });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(1);
      });

      test("null", async () => {
        expect.assertions(2);
        const payload = await request(app)
          .post(CREATE_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send({ name: null });

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(1);
      });
    });

    it("Should return status code 201 given valid Category name", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(CREATE_CATEGORY_ROUTE)
        .set("x-auth-token", testUserId)
        .send({ name: testCategoryName });

      const { status } = payload;
      expect(status).toStrictEqual(201);
    });

    it("Should return status code 400 if a Category with the same name exists", async () => {
      expect.assertions(1);
      const payload = await request(app)
        .post(CREATE_CATEGORY_ROUTE)
        .set("x-auth-token", testUserId)
        .send({ name: testCategoryName });

      const { status } = payload;
      expect(status).toStrictEqual(400);
    });
  });

  describe(`Testing ${CREATE_LABEL_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: 1,
          label: {
            name: 1,
            color: 1
          }
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(3);
      });

      test("Cateogry ID is not of type ObjectId", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: "12345",
          label: {
            name: 1,
            color: 1
          }
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(3);
      });

      test("Empty string", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: "",
          label: {
            name: "",
            color: ""
          }
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(3);
      });

      test("null", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: null,
          label: {
            name: null,
            color: null
          }
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(3);
      });

      test("label is not an object", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: null,
          label: 1
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("label is null", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: null,
          label: null
        };

        const payload = await request(app)
          .post(CREATE_LABEL_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });
    });

    it("Should return status code 404 if an unauthorized tries to add label", async () => {
      const responseBody = {
        categoryId: testCategoryId,
        label: {
          name: "testLabel",
          color: "#f0f0f0"
        }
      };

      const payload = await request(app)
        .post(CREATE_LABEL_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .send(responseBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });

    it("Should return status code 201 given valid inputs from an authorized user", async () => {
      const responseBody = {
        categoryId: testCategoryId,
        label: {
          name: "testLabel",
          color: "#f0f0f0"
        }
      };

      const payload = await request(app)
        .post(CREATE_LABEL_ROUTE)
        .set("x-auth-token", testUserId)
        .send(responseBody);

      const { status } = payload;
      expect(status).toStrictEqual(201);
    });
  });

  describe(`Testing ${GET_CATEGORIES_ROUTE}`, () => {
    it("Should return status code 200", async () => {
      const payload = await request(app)
        .get(GET_CATEGORIES_ROUTE)
        .set("x-auth-token", testUserId)
        .send();

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${GET_LABELS_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not ObjectId", async () => {
        const payload = await request(app)
          .get(GET_LABELS_ROUTE)
          .set("x-auth-token", testUserId)
          .query({ categoryId: "12345" });

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Empty string", async () => {
        const payload = await request(app)
          .get(GET_LABELS_ROUTE)
          .set("x-auth-token", testUserId)
          .query({ categoryId: "" });

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("null", async () => {
        const payload = await request(app)
          .get(GET_LABELS_ROUTE)
          .set("x-auth-token", testUserId)
          .query({ categoryId: null });

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Not string", async () => {
        const payload = await request(app)
          .get(GET_LABELS_ROUTE)
          .set("x-auth-token", testUserId)
          .query({ categoryId: {} });

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });
    });

    it("Should return status code 200 even if an unauthorized tries to get labels", async () => {
      const payload = await request(app)
        .get(GET_LABELS_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .query({ categoryId: testCategoryId });

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 200 if it's a request from an authorized user", async () => {
      const payload = await request(app)
        .get(GET_LABELS_ROUTE)
        .set("x-auth-token", testUserId)
        .query({ categoryId: testCategoryId });

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${EDIT_CATEGORY_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: 1,
          categoryUpdates: {
            name: 1
          }
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Cateogry ID is not of type ObjectId", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: "12345",
          categoryUpdates: {
            name: 1
          }
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("Empty string", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: "",
          categoryUpdates: {
            name: ""
          }
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("null", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: null,
          categoryUpdates: {
            name: null
          }
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("categoryUpdates is not an object", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: 1,
          categoryUpdates: 1
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });

      test("categoryUpdates is null", async () => {
        expect.assertions(2);

        const requestBody = {
          categoryId: null,
          categoryUpdates: null
        };

        const payload = await request(app)
          .post(EDIT_CATEGORY_ROUTE)
          .set("x-auth-token", testUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors).toBeDefined();
        expect(errors.length).toStrictEqual(2);
      });
    });

    it("Should return status code 404 if an unauthorized tries to edit category", async () => {
      expect.assertions(1);

      const requestBody = {
        categoryId: testCategoryId,
        categoryUpdates: {
          name: "Updated"
        }
      };

      const payload = await request(app)
        .post(EDIT_CATEGORY_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });

    it("Should return status code 200 if given valid inputs from an authorized user", async () => {
      expect.assertions(1);

      const requestBody = {
        categoryId: testCategoryId,
        categoryUpdates: {
          name: "Updated"
        }
      };

      const payload = await request(app)
        .post(EDIT_CATEGORY_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${EDIT_LABEL_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: 1,
          labelUpdates: {
            name: 1,
            color: 1
          }
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(3);
      });

      test("Label ID is not of type ObjectId", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: "12345",
          labelUpdates: {
            name: 1,
            color: 1
          }
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(3);
      });

      test("Empty string", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: "",
          labelUpdates: {
            name: "",
            color: ""
          }
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(3);
      });

      test("null", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: null,
          labelUpdates: {
            name: null,
            color: null
          }
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(3);
      });

      test("labelUpdates is not an object", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: 1,
          labelUpdates: 1
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(2);
      });

      test("labelUpdates is null", async () => {
        expect.assertions(1);

        const requestBody = {
          labelId: null,
          labelUpdates: null
        };

        const payload = await request(app)
          .post(EDIT_LABEL_ROUTE)
          .set("x-auth-token", nonAuthorizedUserId)
          .send(requestBody);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(2);
      });
    });

    it("Should return status code 404 if an authorized user tries to edit label", async () => {
      expect.assertions(1);

      const requestBody = {
        labelId: testLabelId,
        labelUpdates: {
          name: "Updated",
          color: "#f0f0f0"
        }
      };

      const payload = await request(app)
        .post(EDIT_LABEL_ROUTE)
        .set("x-auth-token", nonAuthorizedUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(404);
    });

    it("Should return status code 200 if given valid inputs from an authorized user", async () => {
      expect.assertions(1);

      const requestBody = {
        labelId: testLabelId,
        labelUpdates: {
          name: "Updated",
          color: "#f0f0f0"
        }
      };

      const payload = await request(app)
        .post(EDIT_LABEL_ROUTE)
        .set("x-auth-token", testUserId)
        .send(requestBody);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${DELETE_CATEGORY_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(1);

        const requestParam = {
          categoryId: {}
        };

        const payload = await request(app)
          .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Category ID is not of type ObjectId", async () => {
        expect.assertions(1);

        const requestParam = {
          categoryId: "12345"
        };

        const payload = await request(app)
          .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Empty string", async () => {
        expect.assertions(2);

        const requestParam = {
          categoryId: ""
        };

        const payload = await request(app)
          .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
          .set("x-auth-token", testUserId);

        const { status } = payload;
        expect(status).toStrictEqual(404);
        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("null", async () => {
        expect.assertions(1);

        const requestParam = {
          categoryId: null
        };

        const payload = await request(app)
          .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });
    });

    it("Should return status code 200 even if requested by an unauthorized user", async () => {
      expect.assertions(1);

      const requestParam = {
        categoryId: testCategoryId
      };

      const payload = await request(app)
        .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
        .set("x-auth-token", nonAuthorizedUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 200 even if Category does not exist", async () => {
      expect.assertions(1);

      const requestParam = {
        categoryId: testCategoryId
      };

      const payload = await request(app)
        .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
        .set("x-auth-token", nonAuthorizedUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 200 if requested by an authorized user", async () => {
      expect.assertions(1);

      const requestParam = {
        categoryId: testCategoryId
      };

      const payload = await request(app)
        .delete(`${DELETE_CATEGORY_ROUTE}/${requestParam.categoryId}`)
        .set("x-auth-token", testUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });

  describe(`Testing ${DELETE_LABEL_ROUTE}`, () => {
    describe("Validation layer", () => {
      test("Not string", async () => {
        expect.assertions(1);

        const requestParam = {
          labelId: {}
        };

        const payload = await request(app)
          .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Category ID is not of type ObjectId", async () => {
        expect.assertions(1);

        const requestParam = {
          labelId: "12345"
        };

        const payload = await request(app)
          .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("Empty string", async () => {
        expect.assertions(2);

        const requestParam = {
          labelId: ""
        };

        const payload = await request(app)
          .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
          .set("x-auth-token", testUserId);

        const { status } = payload;
        expect(status).toStrictEqual(404);
        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });

      test("null", async () => {
        expect.assertions(1);

        const requestParam = {
          labelId: null
        };

        const payload = await request(app)
          .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
          .set("x-auth-token", testUserId);

        const { errors } = payload.body;
        expect(errors.length).toStrictEqual(1);
      });
    });

    it("Should return status code 200 even if requested by an unauthorized user", async () => {
      expect.assertions(1);

      const requestParam = {
        labelId: testLabelId
      };

      const payload = await request(app)
        .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
        .set("x-auth-token", nonAuthorizedUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 200 even if Label does not exist", async () => {
      expect.assertions(1);

      const requestParam = {
        labelId: testLabelId
      };

      const payload = await request(app)
        .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
        .set("x-auth-token", nonAuthorizedUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });

    it("Should return status code 200 if requested by an authorized user", async () => {
      expect.assertions(1);

      const requestParam = {
        labelId: testLabelId
      };

      const payload = await request(app)
        .delete(`${DELETE_LABEL_ROUTE}/${requestParam.labelId}`)
        .set("x-auth-token", testUserId);

      const { status } = payload;
      expect(status).toStrictEqual(200);
    });
  });
});
