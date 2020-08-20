const ServiceError = require("../utils/errors/serviceError");

let logger = null;

class PostsService {

  constructor (container) {
    this.categoryModel = container.get("CategoryModel");
    this.postModel = container.get("PostModel");
    logger = container.get("logger");
  }

  /**
   * @desc    Create a new Post
   * @returns {object}
   * {
   *   message: string,
   *   post: {
   *     id: ObjectId,
   *     owner: ObjectId,
   *     category: ObjectId,
   *     labels: [ObjectId],
   *     title: string,
   *     url: string,
   *     originalDate: date
   *     imgSrc: string
   *   }
   * }
   *
   * @param   {ObjectId} userId User who created the Post
   * @param   {ObjectId} categoryId Category this Post belongs to
   * @param   {string} title
   * @param   {string} url
   * @param   {object} postAttributes each key optional
   * { originalDate: String, imgSrc: String }
   */
  async createPost (userId, categoryId, title, url, postAttributes) {
    logger.debug("Creating Post");
    const { categoryModel, postModel } = this;

    const categoryRecord = await categoryModel.findOne({ _id: categoryId, owner: userId }).lean();
    if (!categoryRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Category not found" }
      ]);
    }

    const postRecord = await postModel.create({
      owner: userId,
      category: categoryId,
      title,
      url,
      ...postAttributes
    });

    const payload = {
      message: "Post created",
      post: postRecord
    };
    return payload;
  }

  /**
   * @desc    Get Posts
   * @returns {object}
   * {
   *   message: string,
   *   posts: [{
   *     id: ObjectId,
   *     owner: ObjectId,
   *     category: ObjectId,
   *     labels: [ObjectId],
   *     title: string,
   *     url: string,
   *     originalDate: date
   *     imgSrc: string
   *   }
   * }]
   *
   * @param   {ObjectId} userId User who owns the Posts
   * @param   {ObjectId} categoryId optional - Posts of a particular Category
   * @param   {array} labelIds optional - [ObjectId]
   */
  async getPosts (userId, categoryId, labelIds) {
    logger.debug("Getting Posts");
    const { postModel } = this;

    const conditions = {
      owner: userId
    };

    if (categoryId) {
      conditions.category = categoryId;
    }

    if (labelIds) {
      conditions.labels = {
        $elemMatch: {
          $in: labelIds
        }
      };
    }

    const postRecords = await postModel.find(conditions).populate("category");

    const payload = {
      message: "Posts retrieved",
      posts: postRecords
    };
    return payload;
  }

  /**
   * @desc    Get Bookmarked Posts
   * @returns {object}
   * {
   *   message: string,
   *   posts: [{
   *     id: ObjectId,
   *     owner: ObjectId,
   *     category: ObjectId,
   *     labels: [ObjectId],
   *     title: string,
   *     url: string,
   *     originalDate: date
   *     imgSrc: string
   *   }
   * }]
   *
   * @param   {ObjectId} userId User who owns the Posts
   */
  async getBookmarkedPosts (userId) {
    logger.debug("Getting bookmarked Posts");
    const { postModel } = this;

    const conditions = {
      owner: userId,
      isBookmarked: true
    };

    const postRecords = await postModel.find(conditions).populate("category");

    const payload = {
      message: "Posts retrieved",
      posts: postRecords
    };
    return payload;
  }

  /**
   * @desc    Edit a post
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Post
   * @param   {ObjectId} postId The ID of the Post to be edited
   * @param   {string} title
   * @param   {string} url
   * @param   {object} postAttributes each key optional
   * { labels: [ObjectId], originalDate: String, imgSrc: String }
   */
  async editPost (userId, postId, title, url, postAttributes) {
    logger.debug("Updating Post");
    const { postModel } = this;

    const postRecord = await postModel.findOneAndUpdate({ _id: postId, owner: userId }, {
      title,
      url,
      ...postAttributes
    }, { new: true });
    if (!postRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Post not found" }
      ]);
    }
    const payload = {
      message: "Post updated",
      post: postRecord
    };
    return payload;
  }

  /**
   * @desc    Bookmark a post
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Post
   * @param   {ObjectId} postId The ID of the Post to be bookmarked
   * @param   {ObjectId} isNowBookmarked Whether the Post is now bookmarked or not
   */
  async bookmarkPost (userId, postId, isNowBookmarked) {
    logger.debug("Bookmarking Post");
    const { postModel } = this;

    const postRecord = await postModel.findOneAndUpdate({ _id: postId, owner: userId }, {
      isBookmarked: isNowBookmarked
    }, { new: true });
    if (!postRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Post not found" }
      ]);
    }
    const payload = {
      message: "Post updated",
      post: postRecord
    };
    return payload;
  }

  /**
   * @desc    Delete a post
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Posts
   * @param   {ObjectId} postId The Post in question
   */
  async deletePost (userId, postId) {
    logger.debug("Deleting Post");
    const { postModel } = this;

    await postModel.findOneAndDelete({ _id: postId, owner: userId });

    const payload = {
      message: "Post deleted"
    };
    return payload;
  }
}

module.exports = PostsService;
