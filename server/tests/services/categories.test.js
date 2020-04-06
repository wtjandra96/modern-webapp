const container = require("typedi").Container;
const CategoriesService = require("../../src/services/categories");
const ServiceError = require("../../src/utils/errors/serviceError");
const MongoError = require("../../src/utils/errors/mongoError");
const CategoryModel = require("../../src/models/Category");
const LabelModel = require("../../src/models/Label");

const testdb = require("../testdb");

const testUser1 = {
  id: "5e868964c037680d183cd5a3",
  username: "testUser1",
  password: "password"
};

const testUser2 = {
  id: "5e868964c037680d183cd5a4",
  username: "testUser2",
  password: "password"
};

const category1Name = "Category 1";
const category2Name = "Category 2";

describe("Testing CategoriesService", () => {
  beforeAll(() => {
    testdb.connect();
    const categoryModel = {
      name: "CategoryModel",
      model: CategoryModel
    };
    container.set(categoryModel.name, categoryModel.model);

    const labelModel = {
      name: "LabelModel",
      model: LabelModel
    };
    container.set(labelModel.name, labelModel.model);
  });

  afterAll(() => {
    testdb.disconnect();
  });

  describe("CategoriesService.create(userId, name)", () => {
    it("Should allow creation of a Category with six default Labels", async () => {
      expect.assertions(16);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.create(
        testUser1.id,
        category1Name
      );
      const { msg, category } = payload;

      expect(msg).toBeDefined();
      expect(category.name).toStrictEqual(category1Name);
      expect(category.owner.toString()).toStrictEqual(testUser1.id);

      const labels = await LabelModel.find({ category: category.id }).lean();
      expect(labels.length).toStrictEqual(6);
      for (let i = 0; i < labels.length; i += 1) {
        const label = labels[i];
        expect(label.owner.toString()).toStrictEqual(testUser1.id);
        expect(label.category.toString()).toStrictEqual(category.id);
      }
    });

    it("Should allow creation of a Category with a different name", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.create(
        testUser1.id,
        category2Name
      );
      const { msg, category } = payload;

      expect(msg).toBeDefined();
      expect(category.name.toString()).toStrictEqual(category2Name);
      expect(category.owner.toString()).toStrictEqual(testUser1.id);
    });

    it("Should not allow duplicate Category name for the same User", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      try {
        await CategoriesServiceInstance.create(testUser1.id, category1Name);
      } catch (err) {
        expect(err).toBeInstanceOf(MongoError);
        expect(err.httpStatusCode).toStrictEqual(400);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should allow the same Category name if created by a different User", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.create(
        testUser2.id,
        category1Name
      );
      const { msg, category } = payload;

      expect(msg).toBeDefined();
      expect(category.name).toStrictEqual(category1Name);
      expect(category.owner.toString()).toStrictEqual(testUser2.id);
    });
  });

  describe("CategoriesService.getCategories(userId)", () => {
    it("Should get all Categories by userId", async () => {
      expect.assertions(4);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.getCategories(testUser1.id);
      const { msg, categories } = payload;

      expect(msg).toBeDefined();
      expect(categories.length).toStrictEqual(2);
      for (let i = 0; i < categories.length; i += 1) {
        const category = categories[i];
        expect(category.owner.toString()).toStrictEqual(testUser1.id);
      }
    });
  });

  describe("CategoriesService.getLabel(userId, categoryId)", () => {
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
    });

    it("Should get all Labels of a Category", async () => {
      expect.assertions(14);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.getLabels(testUser1.id, testCategory.id);
      const { msg, labels } = payload;

      expect(msg).toBeDefined();
      expect(labels.length).toStrictEqual(6);
      for (let i = 0; i < labels.length; i += 1) {
        const label = labels[i];
        expect(label.owner.toString()).toStrictEqual(testUser1.id);
        expect(label.category.toString()).toStrictEqual(testCategory.id);
      }
    });

    it("Should not get any Label from a Category if the User does not own the Category", async () => {
      expect.assertions(2);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const payload = await CategoriesServiceInstance.getLabels(testUser2.id, testCategory.id);
      const { msg, labels } = payload;

      expect(msg).toBeDefined();
      expect(labels.length).toStrictEqual(0);
    });
  });

  describe("CategoriesService.addLabel(userId, name)", () => {
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
    });

    it("Should throw an error if Category is not found", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const newLabel = {
        name: "Test",
        color: "#000"
      };

      try {
        await CategoriesServiceInstance.addLabel(testUser1.id, null, newLabel);
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toBe(404);
        expect(err.errors.length).toBe(1);
      }
    });

    it("Should not allow non authorized User to add labels", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const newLabel = {
        name: "Test",
        color: "#000"
      };

      try {
        await CategoriesServiceInstance.addLabel(testUser2.id, testCategory.id, newLabel);
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should allow owner to add Labels", async () => {
      expect.assertions(6);

      const CategoriesServiceInstance = container.get(CategoriesService);
      const newLabel = {
        name: "Test",
        color: "#000"
      };
      const payload = await CategoriesServiceInstance.addLabel(
        testUser1.id, testCategory.id, newLabel
      );
      const { msg, label } = payload;

      expect(msg).toBeDefined();
      expect(label.name).toStrictEqual(newLabel.name);
      expect(label.color).toStrictEqual(newLabel.color);
      expect(label.category.toString()).toStrictEqual(testCategory.id);
      expect(label.owner.toString()).toStrictEqual(testUser1.id);

      const labels = await LabelModel.find({ category: testCategory.id }).lean();
      expect(labels.length).toStrictEqual(7);
    });

    it("Should not allow adding a Label with the same name within the same Category", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);

      try {
        const label = {
          name: "Test",
          color: "#000"
        };
        await CategoriesServiceInstance.addLabel(testUser1.id, testCategory.id, label);
      } catch (err) {
        expect(err).toBeInstanceOf(MongoError);
        expect(err.httpStatusCode).toStrictEqual(400);
        expect(err.errors.length).toStrictEqual(1);
      }
    });
  });

  describe("CategoriesService.editLabel(userId, labelId, labelUpdates)", () => {
    let testLabel = null;
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
      testLabel = await LabelModel.findOne({ category: testCategory.id });
    });

    it("Should not allow non authorized User to edit Label", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      try {
        await CategoriesServiceInstance.editLabel(testUser2.id, testLabel.id, {});
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should allow owner to edit Label", async () => {
      expect.assertions(5);

      const CategoriesServiceInstance = container.get(CategoriesService);

      const labelUpdates = {
        name: "Updated",
        color: "#fff"
      };
      const payload = await CategoriesServiceInstance.editLabel(
        testUser1.id, testLabel.id, labelUpdates
      );
      const { msg } = payload;
      expect(msg).toBeDefined();

      const label = await LabelModel.findById(testLabel.id);
      expect(label.name).toStrictEqual(labelUpdates.name);
      expect(label.color).toStrictEqual(labelUpdates.color);
      expect(label.category.toString()).toStrictEqual(testCategory.id);
      expect(label.owner.toString()).toStrictEqual(testUser1.id);
    });
  });

  describe("CategoriesService.deleteLabel(userId, name)", () => {
    let testLabel = null;
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
      testLabel = await LabelModel.findOne({ category: testCategory.id });
    });

    it("Should not allow non authorized User to delete Label", async () => {
      expect.assertions(1);

      const CategoriesServiceInstance = container.get(CategoriesService);

      await CategoriesServiceInstance.deleteLabel(testUser2.id, testLabel.id);
      const label = await LabelModel.findById(testLabel.id);
      expect(label).toBeDefined();
    });

    it("Should allow deleting Label", async () => {
      expect.assertions(1);

      const CategoriesServiceInstance = container.get(CategoriesService);

      await CategoriesServiceInstance.deleteLabel(testUser1.id, testLabel.id);
      const label = await LabelModel.findById(testLabel.id);
      expect(label).toBeNull();
    });
  });

  describe("CategoriesService.edit(userId, name)", () => {
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
    });

    it("Should not allow non authorized User to edit Category", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);
      try {
        await CategoriesServiceInstance.editCategory(testUser2.id, testCategory.id, {});
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should allow editing Category", async () => {
      expect.assertions(3);

      const CategoriesServiceInstance = container.get(CategoriesService);

      const categoryUpdates = {
        name: "Updated"
      };
      const payload = await CategoriesServiceInstance.editCategory(
        testUser1.id, testCategory.id, categoryUpdates
      );
      const { msg } = payload;
      expect(msg).toBeDefined();

      const category = await CategoryModel.findById(testCategory.id);
      expect(category.name).toStrictEqual(categoryUpdates.name);
      expect(category.owner.toString()).toStrictEqual(testUser1.id);
    });
  });

  describe("CategoriesService.delete(userId, name)", () => {
    let testCategory = null;
    beforeAll(async () => {
      testCategory = await CategoryModel.findOne({ owner: testUser1.id });
    });

    it("Should not allow non authorized User to delete Category", async () => {
      expect.assertions(1);

      const CategoriesServiceInstance = container.get(CategoriesService);

      const payload = await CategoriesServiceInstance.deleteCategory(testUser2.id, testCategory.id);
      const { msg } = payload;

      expect(msg).toBeDefined();
    });

    it("Should allow deleting Category", async () => {
      expect.assertions(1);

      const CategoriesServiceInstance = container.get(CategoriesService);

      const payload = await CategoriesServiceInstance.deleteCategory(testUser1.id, testCategory.id);
      const { msg } = payload;

      expect(msg).toBeDefined();
    });
  });
});
