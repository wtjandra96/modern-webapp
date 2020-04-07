const container = require("typedi").Container;
const express = require("express");

const PostsService = require("../../services/posts");
const { isAuth } = require("../middlewares");

const router = express.Router();

/**
 * @route  POST api/posts/create
 * @desc    Create a new Post
 * @access Private
 * @returns {object}
 * {
 *   msg: string,
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
router.post("/create", isAuth, async (req, res) => {
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
    logger.error("POST api/posts/create", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/addLabel
 * @desc    Add Label to a Post
 * @access Private
 * @returns {object} { msg: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in question
 * @param   {ObjectId} labelId ID of Label to be added to Post
 */
router.post("/addLabel", isAuth, async (req, res) => {
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
    logger.error("POST api/posts/addLabel", err.name, err.date, err.errors);
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
 *   msg: string,
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
router.get("/getPosts", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId, labelIds } = req.params;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.get(userId, categoryId, labelIds);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("GET api/posts/getPosts", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/editPost
 * @desc    Edit a post
 * @access Private
 * @returns {object} { msg: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The ID of the Post to be edited
 * @param   {string} title
 * @param   {string} url
 * @param   {object} postAttributes each key optional
 * { labels: [ObjectId], originalDate: String, imgSrc: String }
 */
router.post("/editPost", isAuth, async (req, res) => {
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
    logger.error("POST api/posts/editPost", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});


/**
 * @route  DELETE api/posts/deletePost
 * @desc    Delete a post
 * @access Private
 * @returns {object} { msg: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in question
 */
router.delete("/deletePost", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { postId } = req.params;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.delete(userId, postId);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("DELETE api/posts/deletePost", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/posts/removeLabel
 * @desc    Remove Label from a Post
 * @access Private
 * @returns {object} { msg: string }
 * @param   {ObjectId} userId User who owns the Posts (from isAuth middleware)
 * @param   {ObjectId} postId The Post in questio
 * @param   {ObjectId} labelId ID of Label to be removed from Post
 */
router.post("/removeLabel", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { postId, labelId } = req.params;

  try {
    const postsServiceInstance = container.get(PostsService);
    const payload = await postsServiceInstance.removeLabel(
      userId,
      postId,
      labelId
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("POST api/posts/removeLabel", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

module.exports = (app) => app.use("/auth", router);
