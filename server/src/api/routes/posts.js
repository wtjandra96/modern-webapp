const container = require("typedi").Container;
const express = require("express");

const { celebrate } = require("celebrate");
const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
Joi.objectId = require("joi-objectid")(Joi);
const PostsService = require("../../services/posts");
const { isAuth } = require("../middlewares");

const router = express.Router();
const logger = container.get("logger");

const PREFIX = "/api/posts";

const CREATE_POST_ROUTE = "/createPost";
const GET_POSTS_ROUTE = "/getPosts";
const GET_BOOKMARKED_POSTS_ROUTE = "/getBookmarkedPosts";
const DELETE_POST_ROUTE = "/deletePost";
const EDIT_POST_ROUTE = "/editPost";
const BOOKMARK_POST_ROUTE = "/bookmarkPost";

/**
 * @route   POST api/posts/createPost
 * @desc    Create a new Post
 * @access  Private
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
 *     updatedAt: date (YYYY-MM-DD HH:mm),
 *     imgSrc: string,
 *     source: string,
 *     isBookmarked: boolean
 *   }
 * }
 *
 * @param   {ObjectId} userId User who created the Post (from isAuth middleware)
 * @param   {ObjectId} categoryId Category this Post belongs to
 * @param   {string} title
 * @param   {string} url
 * @param   {object} postAttributes each key optional
 * { updatedAt: date (YYYY-MM-DD HH:mm), imgSrc: string }
 */
router.post(CREATE_POST_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    categoryId: Joi.objectId().message("Category ID is invalid")
      .required().messages({ "any.required": "Category ID is missing" }),
    title: Joi.string().messages({ "string.base": "Post title must be of type string" })
      .required().messages({ "string.empty": "Post title is required" }),
    url: Joi.string().messages({ "string.base": "Post url must be of type string" })
      .required().messages({ "string.empty": "Post url is required" }),
    postAttributes: Joi.object({
      labels: Joi.array().items(
        Joi.objectId().message("Label ID is invalid")
      ).messages({ "array.base": "Labels must be an array" }),
      updatedAt: Joi.date().messages({ "date.base": "Original date must be a date" }),
      imgSrc: Joi.string().messages({ "string.base": "Image source must be of type string" })
    }).messages({ "object.base": "Post attributes must be an object" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + CREATE_POST_ROUTE);

  const { userId } = req;
  const {
    categoryId, title, url, postAttributes
  } = req.body;
  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.createPost(
      userId,
      categoryId,
      title,
      url,
      postAttributes
    );
    return res.status(201).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   GET api/posts/getPosts
 * @desc    Get Posts
 * @access  Private
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
 *     updatedAt: date (YYYY-MM-DD HH:mm),
 *     imgSrc: string,
 *     source: string,
 *     isBookmarked: boolean
 *   }]
 * }
 * }
 *
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} categoryId optional - Posts of a particular Category
 * @param   {array} labelIds optional - [ObjectId]
 */
router.get(GET_POSTS_ROUTE, isAuth, celebrate({
  query: Joi.object().keys({
    categoryId: Joi.objectId().message("Category ID is invalid"),
    labelIds: Joi.array().items(
      Joi.objectId().message("Label ID is invalid")
    ).messages({ "array.base": "Label IDs must be an array" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + GET_POSTS_ROUTE);

  const { userId } = req;
  const { categoryId, labelIds } = req.query;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.getPosts(userId, categoryId, labelIds);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   GET api/posts/getBookmarkedPosts
 * @desc    Get Posts
 * @access  Private
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
 *     updatedAt: date (YYYY-MM-DD HH:mm),
 *     imgSrc: string,
 *     source: string,
 *     isBookmarked: boolean
 *   }]
 * }
 *
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} categoryId optional - Posts of a particular Category
 * @param   {array} labelIds optional - [ObjectId]
 */
router.get(GET_BOOKMARKED_POSTS_ROUTE, isAuth, async (req, res, next) => {
  logger.debug(PREFIX + GET_BOOKMARKED_POSTS_ROUTE);

  const { userId } = req;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.getBookmarkedPosts(userId);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   POST api/posts/bookmarkPost
 * @desc    Edit a post
 * @access  Private
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
 *     updatedAt: date (YYYY-MM-DD HH:mm),
 *     imgSrc: string,
 *     source: string,
 *     isBookmarked: boolean
 *   }
 * }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The ID of the Post to be edited
 * @param   {boolean}  isNowBookmarked Whether the Post is now bookmarked or not
 */
router.post(BOOKMARK_POST_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    postId: Joi.objectId().message("Post ID is invalid")
      .required().messages({ "any.required": "Post ID is missing" }),
    isNowBookmarked: Joi.boolean().messages({ "boolean.base": "Bookmarked value is must be of type boolean" })
      .required().messages({ "boolean.empty": "Bookmarked value is required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + BOOKMARK_POST_ROUTE);

  const { userId } = req;
  const { postId, isNowBookmarked } = req.body;
  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.bookmarkPost(
      userId,
      postId,
      isNowBookmarked
    );
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   POST api/posts/editPost
 * @desc    Edit a post
 * @access  Private
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
 *     updatedAt: date (YYYY-MM-DD HH:mm),
 *     imgSrc: string,
 *     source: string,
 *     isBookmarked: boolean
 *   }
 * }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The ID of the Post to be edited
 * @param   {string} title
 * @param   {string} url
 * @param   {object} postAttributes each key optional
 * { labels: [ObjectId], imgSrc: String }
 */
router.post(EDIT_POST_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    postId: Joi.objectId().message("Post ID is invalid")
      .required().messages({ "any.required": "Post ID is missing" }),
    title: Joi.string().messages({ "string.base": "Post title must be of type string" })
      .required().messages({ "string.empty": "Post title is required" }),
    url: Joi.string().messages({ "string.base": "Post url must be of type string" })
      .required().messages({ "string.empty": "Post url is required" }),
    postAttributes: Joi.object({
      labels: Joi.array().items(
        Joi.objectId().message("Label ID is invalid")
      ).messages({ "array.base": "Labels must be an array" }),
      imgSrc: Joi.string().messages({ "string.base": "Image source must be of type string" })
    }).messages({ "object.base": "Post attributes must be an object" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + EDIT_POST_ROUTE);

  const { userId } = req;
  const {
    postId, title, url, postAttributes
  } = req.body;
  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.editPost(
      userId,
      postId,
      title,
      url,
      postAttributes
    );
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   DELETE api/posts/deletePost/:postId
 * @desc    Delete a post
 * @access  Private
 * @returns {object} { message: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in question
 */
router.delete(`${DELETE_POST_ROUTE}/:postId`, isAuth, celebrate({
  params: Joi.object().keys({
    postId: Joi.objectId().message("Post ID is invalid")
      .required().messages({ "any.required": "Post ID is missing" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + DELETE_POST_ROUTE);

  const { userId } = req;
  const { postId } = req.params;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.deletePost(userId, postId);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

module.exports = (app) => app.use("/posts", router);

const postsRoute = module.exports;
postsRoute.CREATE_POST_ROUTE = PREFIX + CREATE_POST_ROUTE;
postsRoute.GET_POSTS_ROUTE = PREFIX + GET_POSTS_ROUTE;
postsRoute.DELETE_POST_ROUTE = PREFIX + DELETE_POST_ROUTE;
postsRoute.EDIT_POST_ROUTE = PREFIX + EDIT_POST_ROUTE;
