const container = require("typedi").Container;
const express = require("express");

const CategoriesService = require("../../services/categories");
const { isAuth } = require("../middlewares");

const router = express.Router();

/**
 * @route  POST api/categories/create
 * @desc   Create a new Category
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} name
 */
router.post("/create", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { name } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.create(
      userId,
      name
    );
    return res.status(201).send(payload);
  } catch (err) {
    logger.error("POST api/categories/create", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/categories/addLabel
 * @desc   Add a Label to a Category
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} categoryId
 * @param  {object} label // { name, color }
 */
router.post("/addLabel", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId, label } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.addLabel(
      userId,
      categoryId,
      label
    );
    return res.status(201).send(payload);
  } catch (err) {
    logger.error("POST api/categories/addLabel", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  GET api/categories/getCategories
 * @desc   Get Categories by User
 * @access Private
 * @param  {string} userId // from token
 */
router.get("/getCategories", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.get(userId);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("GET api/categories/getCategories", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  GET api/categories/getLabels
 * @desc   Get Labels of a Category
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} categoryId
 */
router.get("/getLabels", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId } = req.query;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.getLabels(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("GET api/categories/getLabels", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/categories/editCategory
 * @desc   Edit a Category
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} categoryId
 * @param  {object} categoryUpdates
 */
router.post("/editCategory", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId, categoryUpdates } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.editCategory(
      userId,
      categoryId,
      categoryUpdates
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("POST api/categories/editCategory", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/categories/editLabel
 * @desc   Edit a Label
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} labelId
 * @param  {object} labelUpdates // { name, color }
 */
router.post("/editLabel", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { labelId, labelUpdates } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.editLabel(
      userId,
      labelId,
      labelUpdates
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("POST api/categories/editLabel", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  DELETE api/categories/deleteCategory
 * @desc   Delete a Category
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} categoryId
 */
router.delete("/deleteCategory", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { categoryId } = req.params;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.deleteCategory(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("DELETE api/categories/deleteCategory", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  DELETE api/categories/deleteLabel
 * @desc   Delete a Label
 * @access Private
 * @param  {string} userId // from token
 * @param  {string} labelId
 */
router.delete("/deleteLabel", isAuth, async (req, res) => {
  const logger = container.get("logger");

  const { userId } = req;
  const { labelId } = req.params;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.deleteLabel(
      userId,
      labelId
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("DELETE api/categories/deleteLabel", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

module.exports = (app) => app.use("/auth", router);
