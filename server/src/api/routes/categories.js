const container = require("typedi").Container;
const express = require("express");

const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const CategoriesService = require("../../services/categories");
const { isAuth } = require("../middlewares");

const router = express.Router();

const PREFIX = "/api/categories";

const CREATE_CATEGORY_ROUTE = "/createCategory";
const CREATE_LABEL_ROUTE = "/createLabel";
const GET_LABELS_ROUTE = "/getLabels";
const GET_CATEGORIES_ROUTE = "/getCategories";
const DELETE_LABEL_ROUTE = "/deleteLabel";
const DELETE_CATEGORY_ROUTE = "/deleteCategory";
const EDIT_LABEL_ROUTE = "/editLabel";
const EDIT_CATEGORY_ROUTE = "/editCategory";

/**
 * @route  POST api/categories/createCategory
 * @desc   Create a new Category
 * @access Private
 * @returns {object}
 * {
 *   message: string,
 *   category: {
 *     id: ObjectId,
 *     owner: ObjectId,
 *     name: string
 *   }
 * }
 *
 * @returns {object} payload.category
 * @param   {ObjectId} userId User who created the Category (from middleware)
 * @param   {string} name
 */
router.post(CREATE_CATEGORY_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().messages({ "string.base": "Category name must be of type string" })
      .required().messages({ "string.empty": "Category name is required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  const { userId } = req;
  const { name } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.createCategory(
      userId,
      name
    );
    return res.status(201).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  POST api/categories/createLabel
 * @desc   Add a Label to a Category
 * @access Private
 * @returns {object}
 * {
 *   message: string,
 *   label: {
 *     id: ObjectId,
 *     owner: ObjectId,
 *     category: ObjectId,
 *     name: string
 *     color: string
 *   }
 * }
*
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId ID of this Category
 * @param   {object} label { name: string, color: string }
 */
router.post(CREATE_LABEL_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    categoryId: Joi.objectId().message("Category ID is invalid")
      .required().messages({ "any.required": "Category ID is missing" }),

    label: Joi.object({
      name: Joi.string().messages({ "string.base": "Label name must be of type string" })
        .required().messages({ "string.empty": "Label name is required" }),
      color: Joi.string().messages({ "string.base": "Label color must be of type string" })
    })
      .messages({ "object.base": "Label information must be an object" })
      .required()
      .messages({ "object.empty": "Label information is required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  const { userId } = req;
  const { categoryId, label } = req.body;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.createLabel(
      userId,
      categoryId,
      label
    );
    return res.status(201).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  GET api/categories/getCategories
 * @desc   Get all Categories by User
 * @access Private
 * @returns {object}
 * {
 *   message: string,
 *   categories: [{
 *     owner: ObjectId,
 *     name: string
 *   }]
 * }
 *
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 */
router.get(GET_CATEGORIES_ROUTE, isAuth, async (req, res, next) => {
  const { userId } = req;
  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.getCategories(userId);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  GET api/categories/getLabels
 * @desc   Get all Labels of a Category
 * @access Private
 * @returns {object}
 * {
 *   message: string,
 *   labels: [{
 *     owner: ObjectId,
 *     category: ObjectId,
 *     name: string
 *     color: string
 *   }]
 * }
 *
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId The Category in question
 */
router.get(GET_LABELS_ROUTE, isAuth, celebrate({
  query: {
    categoryId: Joi.objectId().message("Category ID is invalid")
      .required().messages({ "any.required": "Category ID is missing" })
  }
}, { abortEarly: false }), async (req, res, next) => {
  const { userId } = req;
  const { categoryId } = req.query;
  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.getLabels(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  POST api/categories/editCategory
 * @desc   Edit a Category
 * @access Private
 * @returns {object} { message: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId ID of this Category
 * @param   {object} categoryUpdates { name: string }
 */
router.post(EDIT_CATEGORY_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    categoryId: Joi.objectId().message("Category ID is invalid")
      .required().messages({ "any.required": "Category ID is missing" }),
    categoryUpdates: Joi.object({
      name: Joi.string().messages({ "string.base": "Category name must be of type string" })
    })
      .messages({ "object.base": "Category updates must be an object" })
      .required()
      .messages({ "object.empty": "Category updates are required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
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
    return next(err);
  }
});

/**
 * @route  POST api/categories/editLabel
 * @desc   Edit a Label
 * @access Private
 * @returns {object} { message: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} labelId ID of the Label in question
 * @param   {object} labelUpdates { name: string, color: string }
 */
router.post(EDIT_LABEL_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    labelId: Joi.objectId().message("Label ID is invalid")
      .required().messages({ "any.required": "Label ID is missing" }),

    labelUpdates: Joi.object({
      name: Joi.string().messages({ "string.base": "Label name must be of type string" }),
      color: Joi.string().messages({ "string.base": "Label color must be of type string" })
    })
      .messages({ "object.base": "Label updates must be an object" })
      .required()
      .messages({ "object.empty": "Label updates are required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
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
    return next(err);
  }
});

/**
 * @route  DELETE api/categories/deleteCategory/:categoryId
 * @desc   Delete a Category
 * @access Private
 * @returns {object} { message: string }
 * @param   {ObjectId} userId User who owns the Category (from middleware)
 * @param   {ObjectId} categoryId
 */
router.delete(`${DELETE_CATEGORY_ROUTE}/:categoryId`, isAuth, celebrate({
  params: {
    categoryId: Joi.objectId().message("Category ID is invalid")
  }
}, { abortEarly: false }), async (req, res, next) => {
  const { userId } = req;
  const { categoryId } = req.params;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.deleteCategory(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  DELETE api/categories/deleteLabel
 * @desc   Delete a Label
 * @access Private
 * @returns {object} { message: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} labelId ID of the Label in question
 */
router.delete(`${DELETE_LABEL_ROUTE}/:labelId`, isAuth, celebrate({
  params: Joi.object().keys({
    labelId: Joi.objectId().message("Label ID is invalid")
      .required().messages({ "any.required": "Label ID is missing" })
  })
}, { abortEarly: false }), async (req, res, next) => {
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
    return next(err);
  }
});

module.exports = (app) => app.use("/categories", router);

const categoriesRoute = module.exports;
categoriesRoute.CREATE_CATEGORY_ROUTE = PREFIX + CREATE_CATEGORY_ROUTE;
categoriesRoute.CREATE_LABEL_ROUTE = PREFIX + CREATE_LABEL_ROUTE;
categoriesRoute.GET_CATEGORIES_ROUTE = PREFIX + GET_CATEGORIES_ROUTE;
categoriesRoute.GET_LABELS_ROUTE = PREFIX + GET_LABELS_ROUTE;
categoriesRoute.EDIT_CATEGORY_ROUTE = PREFIX + EDIT_CATEGORY_ROUTE;
categoriesRoute.EDIT_LABEL_ROUTE = PREFIX + EDIT_LABEL_ROUTE;
categoriesRoute.DELETE_CATEGORY_ROUTE = PREFIX + DELETE_CATEGORY_ROUTE;
categoriesRoute.DELETE_LABEL_ROUTE = PREFIX + DELETE_LABEL_ROUTE;
