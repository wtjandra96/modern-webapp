const container = require("typedi").Container;
const logger = require("../logger");

container.set("logger", logger);

const PostsService = require("../../src/services/posts");
const ServiceError = require("../../src/utils/errors/serviceError");
const LabelModel = require("../../src/models/Label");
const CategoryModel = require("../../src/models/Category");
const PostModel = require("../../src/models/Post");

const testdb = require("../testdb");

const testUser1Id = "5e868964c037680d183cd5a3";
const testUser2Id = "5e868964c037680d183cd5a4";
const testCategory2Id = "5e868964c037680d183cd5a6";
const testLabel1Id = "5e868964c037680d183cd5a7";
const testLabel2Id = "5e868964c037680d183cd5a8";
const sampleTitle = "Sample Title";
const sampleUrl = "https://www.example.com";
const sampleImgSrc = null;

describe("Testing PostsService", () => {
  let testCategory1Id = null;
  beforeAll(async () => {
    await testdb.connect();
    container.set("CategoryModel", CategoryModel);
    container.set("LabelModel", LabelModel);
    container.set("PostModel", PostModel);
    const category = await CategoryModel.create({
      owner: testUser1Id,
      name: "Category"
    });
    testCategory1Id = category.id;
  });

  afterAll(async () => {
    await testdb.disconnect();
  });

  describe("PostsService.createPost(userId, categoryId, title, url, postAttributes)", () => {
    it("Should allow creation of a post", async () => {
      const postsServiceInstance = container.get(PostsService);

      const postAttributes = {
        labels: [testLabel1Id, testLabel2Id],
        imgSrc: sampleImgSrc
      };

      const payload = await postsServiceInstance.createPost(
        testUser1Id, testCategory1Id, sampleTitle, sampleUrl, postAttributes
      );
      const { message, post } = payload;
      expect(message).toBeDefined();
      expect(post.owner.toString()).toStrictEqual(testUser1Id);
      expect(post.category.toString()).toStrictEqual(testCategory1Id);
      expect(post.title).toStrictEqual(sampleTitle);
      expect(post.url).toStrictEqual(sampleUrl);
      expect(post.labels.length).toStrictEqual(postAttributes.labels.length);
      expect(post.imgSrc).toStrictEqual(sampleImgSrc);
    });

    it("Should allow creation of a post with default values for postAttributes", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.createPost(
        testUser1Id, testCategory1Id, sampleTitle, sampleUrl
      );
      const { message, post } = payload;
      expect(message).toBeDefined();
      expect(post.owner.toString()).toStrictEqual(testUser1Id);
      expect(post.category.toString()).toStrictEqual(testCategory1Id);
      expect(post.title).toStrictEqual(sampleTitle);
      expect(post.url).toStrictEqual(sampleUrl);
      expect(post.labels.length).toStrictEqual(0);
      expect(post.imgSrc).toBeNull();
    });

    it("Should not allow creating a Post on a Category the User does not own", async () => {
      const postsServiceInstance = container.get(PostsService);

      try {
        await postsServiceInstance.createPost(
          testUser2Id, testCategory1Id, sampleTitle, sampleUrl
        );
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });
  });

  describe("PostsService.getPosts(userId, categoryId, labelIds)", () => {
    it("Should get all of User's Posts if categoryId is not provided", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.getPosts(testUser1Id);
      const { message, posts } = payload;
      expect(message).toBeDefined();
      expect(posts.length).toStrictEqual(2);
      for (let i = 0; i < posts.length; i += 1) {
        const post = posts[i];
        expect(post.owner.toString()).toStrictEqual(testUser1Id);
      }
    });

    it("Should only get Posts that the User owns within the requested Category", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.getPosts(testUser1Id, testCategory1Id);
      const { message, posts } = payload;
      expect(message).toBeDefined();
      expect(posts.length).toStrictEqual(2);

      for (let i = 0; i < posts.length; i += 1) {
        const post = posts[i];
        expect(post.owner.toString()).toStrictEqual(testUser1Id);
        expect(post.category.id.toString()).toStrictEqual(testCategory1Id);
      }
    });

    it("Should not return Posts that are not within the requested Category", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.getPosts(testUser1Id, testCategory2Id);
      const { message, posts } = payload;
      expect(message).toBeDefined();
      expect(posts.length).toStrictEqual(0);
    });

    it("Should only get Posts that the User owns containing at least one of the active Labels within the requested Category", async () => {
      const postsServiceInstance = container.get(PostsService);

      const labelIds = [testLabel1Id];
      const payload = await postsServiceInstance.getPosts(testUser1Id, testCategory1Id, labelIds);
      const { message, posts } = payload;
      expect(message).toBeDefined();
      expect(posts.length).toStrictEqual(1);
    });
  });

  describe("PostsService.editPost(userId, postId, title, url, postAttributes)", () => {
    let testPost = null;
    beforeAll(async () => {
      testPost = await PostModel.findOne({ owner: testUser1Id, category: testCategory1Id });
    });

    it("Should throw an error if Post is not found", async () => {
      const postsServiceInstance = container.get(PostsService);

      try {
        await postsServiceInstance.editPost(testUser1Id, null, sampleTitle, sampleUrl, null);
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should not allow non authorized User to edit Post", async () => {
      const postsServiceInstance = container.get(PostsService);

      const postAttributes = {
        labels: [testLabel1Id, testLabel2Id],
        imgSrc: sampleImgSrc
      };
      try {
        await postsServiceInstance.editPost(
          testUser2Id, testPost.id, sampleTitle, sampleUrl, postAttributes
        );
      } catch (err) {
        expect(err).toBeInstanceOf(ServiceError);
        expect(err.httpStatusCode).toStrictEqual(404);
        expect(err.errors.length).toStrictEqual(1);
      }
    });

    it("Should allow owner to edit the Post", async () => {
      const postsServiceInstance = container.get(PostsService);

      const newTitle = "Updated";
      const newUrl = "Random URL";
      const postAttributes = {
        imgSrc: sampleImgSrc
      };
      const payload = await postsServiceInstance.editPost(
        testUser1Id, testPost.id, newTitle, newUrl, postAttributes
      );
      const { message } = payload;
      expect(message).toBeDefined();

      const post = await PostModel.findById(testPost.id);
      expect(post.owner.toString()).toStrictEqual(testUser1Id);
      expect(post.category.toString()).toStrictEqual(testCategory1Id);
      expect(post.labels.length).toStrictEqual(testPost.labels.length);
      expect(post.title).toStrictEqual(newTitle);
      expect(post.url).toStrictEqual(newUrl);
      expect(post.imgSrc).toStrictEqual(postAttributes.imgSrc);
      expect(post.source).not.toEqual(postAttributes.source);
    });
  });

  describe("PostsService.deletePost(userId, postId)", () => {
    let testPost = null;
    beforeAll(async () => {
      testPost = await PostModel.findOne({ owner: testUser1Id, category: testCategory1Id });
    });

    it("Should not allow non authorized User to delete Post", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.deletePost(testUser2Id, testPost.id);
      const { message } = payload;
      expect(message).toBeDefined();

      const post = await PostModel.findById(testPost.id);
      expect(post).toBeDefined();
    });

    it("Should allow owner to delete the Post", async () => {
      const postsServiceInstance = container.get(PostsService);

      const payload = await postsServiceInstance.deletePost(testUser1Id, testPost.id);
      const { message } = payload;
      expect(message).toBeDefined();

      const post = await PostModel.findById(testPost.id);
      expect(post).toBeNull();
    });
  });
});
