const container = require("typedi").Container;
const express = require("express");

const { celebrate, Joi } = require("celebrate");
const CategoriesService = require("../../services/categories");
const { isAuth } = require("../middlewares");

const router = express.Router();

const POST = "POST";
const GET = "GET";
const DELETE = "DELETE";
const PREFIX = "api/categories";

const CREATE_ROUTE = "/create";
const ADD_LABEL_ROUTE = "/addLabel";
const GET_LABELS_ROUTE = "/getLabels";
const GET_CATEGORIES_ROUTE = "/getCategories";
const DELETE_LABEL_ROUTE = "/deleteLabel";
const DELETE_CATEGORY_ROUTE = "/deleteCategory";
const EDIT_LABEL_ROUTE = "/editLabel";
const EDIT_CATEGORY_ROUTE = "/editCategory";

const FULL_CREATE_ROUTE = `${POST} ${PREFIX}${CREATE_ROUTE}`;
const FULL_ADD_LABEL_ROUTE = `${POST} ${PREFIX}${ADD_LABEL_ROUTE}`;
const FULL_GET_CATEGORIES_ROUTE = `${GET} ${PREFIX}${GET_CATEGORIES_ROUTE}`;
const FULL_GET_LABELS_ROUTE = `${GET} ${PREFIX}${GET_LABELS_ROUTE}`;
const FULL_EDIT_CATEGORY_ROUTE = `${POST} ${PREFIX}${EDIT_CATEGORY_ROUTE}`;
const FULL_EDIT_LABEL_ROUTE = `${POST} ${PREFIX}${EDIT_LABEL_ROUTE}`;
const FULL_DELETE_CATEGORY_ROUTE = `${DELETE} ${PREFIX}${DELETE_CATEGORY_ROUTE}`;
const FULL_DELETE_LABEL_ROUTE = `${DELETE} ${PREFIX}${DELETE_LABEL_ROUTE}`;

/**
 * @route  POST api/categories/create
 * @desc   Create a new Category
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   category: {
 *     owner: ObjectId,
 *     name: string
 *   }
 * }
 *
 * @returns {object} payload.category
 * @param   {ObjectId} userId User who created the Category (from middleware)
 * @param   {string} name
 */
router.post(CREATE_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_CREATE_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_CREATE_ROUTE}: User ID is missing` }),

  body: Joi.object({
    name: Joi.string().messages({ "string.base": `${FULL_CREATE_ROUTE}: Category name must be of type string` })
      .required().messages({ "string.empty": `${FULL_CREATE_ROUTE}: Category name is required` })
  })
}), async (req, res, next) => {
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
    err.message = `${FULL_CREATE_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  POST api/categories/addLabel
 * @desc   Add a Label to a Category
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   label: {
 *     owner: ObjectId,
 *     category: ObjectId,
 *     name: string
 *     color: string,
 *     checked: boolean
 *   }
 * }
*
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId ID of this Category
 * @param   {object} label { name: string, color: string }
 */
router.post(ADD_LABEL_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_ADD_LABEL_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_ADD_LABEL_ROUTE}: User ID is missing` }),

  body: Joi.object({
    categoryId: Joi.string().messages({ "string.base": `${FULL_ADD_LABEL_ROUTE}: Category ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_ADD_LABEL_ROUTE}: Category ID is missing` }),

    label: Joi.object({
      name: Joi.string().messages({ "string.base": `${FULL_ADD_LABEL_ROUTE}: Label name must be of type string` })
        .required().messages({ "string.empty": `${FULL_ADD_LABEL_ROUTE}: Label name is required` }),
      color: Joi.string().messages({ "string.base": `${FULL_ADD_LABEL_ROUTE}: Label color must be of type string` })
    })
      .messages({ "object.base": `${FULL_ADD_LABEL_ROUTE}: Label information must be an object` })
      .required()
      .messages({ "object.empty": `${FULL_ADD_LABEL_ROUTE}: Label information is required` })
  })
}), async (req, res, next) => {
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
    err.message = `${FULL_ADD_LABEL_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  GET api/categories/getCategories
 * @desc   Get all Categories by User
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   categories: [{
 *     owner: ObjectId,
 *     name: string
 *   }]
 * }
 *
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 */
router.get(GET_CATEGORIES_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_GET_CATEGORIES_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_GET_CATEGORIES_ROUTE}: User ID is missing` })
}), async (req, res, next) => {
  const { userId } = req;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.get(userId);
    return res.status(200).send(payload);
  } catch (err) {
    err.message = `${FULL_GET_CATEGORIES_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  GET api/categories/getLabels
 * @desc   Get all Labels of a Category
 * @access Private
 * @returns {object}
 * {
 *   errorMessage: string,
 *   labels: [{
 *     owner: ObjectId,
 *     category: ObjectId,
 *     name: string
 *     color: string,
 *     checked: boolean
 *   }]
 * }
 *
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId The Category in question
 */
router.get(GET_LABELS_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_GET_LABELS_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_GET_LABELS_ROUTE}: User ID is missing` }),

  body: Joi.object({
    categoryId: Joi.string().messages({ "string.base": `${FULL_GET_LABELS_ROUTE}: Category ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_GET_LABELS_ROUTE}: Category ID is missing` })
  })
}), async (req, res, next) => {
  const { userId } = req;
  const { categoryId } = req.query;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.getLabels(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    err.message = `${FULL_GET_LABELS_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  POST api/categories/editCategory
 * @desc   Edit a Category
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} categoryId ID of this Category
 * @param   {object} categoryUpdates { name: string }
 */
router.post(EDIT_CATEGORY_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_EDIT_CATEGORY_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_EDIT_CATEGORY_ROUTE}: User ID is missing` }),

  body: Joi.object({
    categoryId: Joi.string().messages({ "string.base": `${FULL_EDIT_CATEGORY_ROUTE}: Category ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_EDIT_CATEGORY_ROUTE}: Category ID is missing` }),
    categoryUpdates: Joi.object({
      name: Joi.string().messages({ "string.base": `${FULL_EDIT_CATEGORY_ROUTE}: Category name must be of type string` })
    })
      .messages({ "object.base": `${FULL_EDIT_CATEGORY_ROUTE}: Category updates must be an object` })
      .required()
      .messages({ "object.empty": `${FULL_EDIT_CATEGORY_ROUTE}: Category updates are required` })
  })
}), async (req, res, next) => {
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
    err.message = `${FULL_EDIT_CATEGORY_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  POST api/categories/editLabel
 * @desc   Edit a Label
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} labelId ID of the Label in question
 * @param   {object} labelUpdates { name: string, color: string }
 */
router.post(EDIT_LABEL_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_EDIT_LABEL_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_EDIT_LABEL_ROUTE}: User ID is missing` }),

  body: Joi.object({
    labelId: Joi.string().messages({ "string.base": `${FULL_EDIT_LABEL_ROUTE}: Label ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_EDIT_LABEL_ROUTE}: Label ID is missing` }),

    labelUpdates: Joi.object({
      name: Joi.string().messages({ "string.base": `${FULL_EDIT_LABEL_ROUTE}: Label name must be of type string` }),
      color: Joi.string().messages({ "string.base": `${FULL_EDIT_LABEL_ROUTE}: Label color must be of type string` })
    })
      .messages({ "object.base": `${FULL_EDIT_LABEL_ROUTE}: Label updates must be an object` })
      .required()
      .messages({ "object.empty": `${FULL_EDIT_LABEL_ROUTE}: Label updates are required` })
  })
}), async (req, res, next) => {
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
    err.message = `${FULL_EDIT_LABEL_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  DELETE api/categories/deleteCategory
 * @desc   Delete a Category
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Category (from middleware)
 * @param   {ObjectId} categoryId
 */
router.delete(DELETE_CATEGORY_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_DELETE_CATEGORY_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_DELETE_CATEGORY_ROUTE}: User ID is missing` }),

  body: Joi.object({
    categoryId: Joi.string().messages({ "string.base": `${FULL_DELETE_CATEGORY_ROUTE}: Category ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_DELETE_CATEGORY_ROUTE}: Category ID is missing` })
  })
}), async (req, res, next) => {
  const { userId } = req;
  const { categoryId } = req.query;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.deleteCategory(userId, categoryId);
    return res.status(200).send(payload);
  } catch (err) {
    err.message = `${FULL_DELETE_CATEGORY_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  DELETE api/categories/deleteLabel
 * @desc   Delete a Label
 * @access Private
 * @returns {object} { errorMessage: string }
 * @param   {ObjectId} userId User who owns the Categories (from middleware)
 * @param   {ObjectId} labelId ID of the Label in question
 */
router.delete(DELETE_LABEL_ROUTE, isAuth, celebrate({
  userId: Joi.string().messages({ "string.base": `${FULL_DELETE_LABEL_ROUTE}: User ID must be of type string` })
    .required().messages({ "string.empty": `${FULL_DELETE_LABEL_ROUTE}: User ID is missing` }),

  body: Joi.object({
    labelId: Joi.string().messages({ "string.base": `${FULL_DELETE_LABEL_ROUTE}: Label ID must be of type string` })
      .required().messages({ "string.empty": `${FULL_DELETE_LABEL_ROUTE}: Label ID is missing` })
  })
}), async (req, res, next) => {
  const { userId } = req;
  const { labelId } = req.query;

  try {
    const categoriesServiceInstance = container.get(CategoriesService);
    const payload = await categoriesServiceInstance.deleteLabel(
      userId,
      labelId
    );
    return res.status(200).send(payload);
  } catch (err) {
    err.message = `${FULL_DELETE_LABEL_ROUTE}: ${err.name}`;
    return next(err);
  }
});

module.exports = (app) => app.use("/categories", router);
module.exports = {
  FULL_CREATE_ROUTE,
  FULL_ADD_LABEL_ROUTE,
  FULL_GET_CATEGORIES_ROUTE,
  FULL_GET_LABELS_ROUTE,
  FULL_EDIT_CATEGORY_ROUTE,
  FULL_EDIT_LABEL_ROUTE,
  FULL_DELETE_CATEGORY_ROUTE,
  FULL_DELETE_LABEL_ROUTE
};
