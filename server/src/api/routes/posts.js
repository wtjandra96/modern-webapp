const container = require("typedi").Container;
const express = require("express");

const { celebrate, Joi } = require("celebrate");
const PostsService = require("../../services/posts");
const { isAuth } = require("../middlewares");

const router = express.Router();

const POST = "POST";
const GET = "GET";
const DELETE = "DELETE";
const PREFIX = "api/posts";

const CREATE_ROUTE = "/create";
const ADD_LABEL_ROUTE = "/addLabel";
const GET_POSTS_ROUTE = "/getPosts";
const DELETE_POST_ROUTE = "/deletePost";
const EDIT_POST_ROUTE = "/editPost";
const REMOVE_LABEL_ROUTE = "/removeLabel";

/**
 * @route  POST api/posts/create
 * @desc    Create a new Post
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   post: {
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
 * @param   {ObjectId} userId User who created the Post (from isAuth middleware)
 * @param   {ObjectId} categoryId Category this Post belongs to
 * @param   {string} title
 * @param   {string} url
 * @param   {object} postAttributes each key optional
 * { originalDate: String, imgSrc: String }
 */
router.post(CREATE_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    categoryId: Joi.string().required(),
    title: Joi.string().required(),
    url: Joi.string().required(),
    postAttributes: Joi.object({
      originalDate: Joi.date(),
      imgSrc: Joi.string()
    })
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const {
    categoryId, title, url, postAttributes
  } = req.body;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.create(
      userId,
      categoryId,
      title,
      url,
      postAttributes
    );
    return res.status(201).send(payload);
  } catch (err) {
    logger.error(
      `${POST} - ${PREFIX}${CREATE_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/addLabel
 * @desc    Add Label to a Post
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in question
 * @param   {ObjectId} labelId ID of Label to be added to Post
 */
router.post(ADD_LABEL_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    postId: Joi.string().required(),
    labelId: Joi.string().required()
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { postId, label } = req.body;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.addLabel(
      userId,
      postId,
      label
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error(
      `${POST} - ${PREFIX}${ADD_LABEL_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  GET api/posts/getPosts
 * @desc    Get Posts
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   posts: [{
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
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} categoryId Posts of a particular Category
 * @param   {array} labelIds optional [ObjectId]
 */
router.get(GET_POSTS_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    categoryId: Joi.string().required(),
    labelIds: Joi.array().items(Joi.string())
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId, labelIds } = req.query;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.get(userId, categoryId, labelIds);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error(
      `${GET} - ${PREFIX}${GET_POSTS_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/editPost
 * @desc    Edit a post
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The ID of the Post to be edited
 * @param   {string} title
 * @param   {string} url
 * @param   {object} postAttributes each key optional
 * { labels: [ObjectId], originalDate: String, imgSrc: String }
 */
router.post(EDIT_POST_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    postId: Joi.string().required(),
    title: Joi.string().required(),
    url: Joi.string().required(),
    postAttributes: Joi.object({
      labels: Joi.array().items(Joi.string()),
      originalDate: Joi.date(),
      imgsrc: Joi.string()
    })
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const {
    postId, title, url, postAttributes
  } = req.body;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.edit(
      userId,
      postId,
      title,
      url,
      postAttributes
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error(
      `${POST} - ${PREFIX}${EDIT_POST_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});


/**
 * @route  DELETE api/posts/deletePost
 * @desc    Delete a post
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in question
 */
router.delete(DELETE_POST_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    postId: Joi.string().required()
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { postId } = req.query;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.delete(userId, postId);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error(
      `${DELETE} - ${PREFIX}${DELETE_POST_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/removeLabel
 * @desc    Remove Label from a Post
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in questio
 * @param   {ObjectId} labelId ID of Label to be removed from Post
 */
router.post(REMOVE_LABEL_ROUTE, isAuth, celebrate({
  userId: Joi.string().required(),
  body: Joi.object({
    postId: Joi.string().required(),
    labelId: Joi.string().required()
  })
}), async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { postId, labelId } = req.body;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.removeLabel(
      userId,
      postId,
      labelId
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error(
      `${POST} - ${PREFIX}${REMOVE_LABEL_ROUTE}: ${err.name} ${JSON.stringify(err.errors)}} | ${err.date}`
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

module.exports = (app) => app.use("/posts", router);
