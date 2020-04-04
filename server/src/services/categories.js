const ServiceError = require("../utils/errors/serviceError");

class CategoriesService {
  constructor (container) {
    this.categoryModel = container.get("CategoryModel");
    this.labelModel = container.get("LabelModel");
  }

  /**
   * @desc    Create a new Category
   * @returns {string} payload.msg
   * @returns {object} payload.category
   * @param   {string} userId // User who created the Category
   * @param   {string} name
   */
  async create (userId, name) {
    const { categoryModel } = this;

    const categoryRecord = await categoryModel.create({
      owner: userId,
      name
    });

    const payload = {
      msg: "Category created",
      category: categoryRecord
    };
    return payload;
  }

  /**
   * @desc    Get all Categories by User
   * @returns {string} payload.msg
   * @returns {object} payload.categories
   * @param   {string} userId // User who owns the Categories
   */
  async getCategories (userId) {
    const { categoryModel } = this;

    const categoryRecords = await categoryModel.find({ owner: userId });

    const payload = {
      msg: "Categories retrieved",
      categories: categoryRecords
    };
    return payload;
  }

  /**
   * @desc    Get all Labels of a Category
   * @returns {string} payload.msg
   * @returns {object} payload.categories
   * @param   {string} userId // User who owns the Categories
   * @param   {string} categoryId // The Category in question
   */
  async getLabels (userId, categoryId) {
    const { labelModel } = this;

    const labelRecords = await labelModel.find({ owner: userId, category: categoryId });

    const payload = {
      msg: "Labels retrieved",
      labels: labelRecords
    };
    return payload;
  }

  /**
   * @desc    Add a Label to a Category
   * @returns {string} payload.msg
   * @param   {string} userId // User who owns the Categories
   * @param   {string} categoryId // ID of this Category
   * @param   {object} label // { name, color }
   */
  async addLabel (userId, categoryId, label) {
    const { categoryModel, labelModel } = this;

    const categoryRecord = await categoryModel.findOne({ _id: categoryId, owner: userId }).lean();
    if (!categoryRecord) {
      throw new ServiceError(404, [
        { msg: "Category not found" }
      ]);
    }

    const labelRecord = await labelModel.create({
      owner: userId,
      category: categoryId,
      ...label
    });

    const payload = {
      msg: `Label ${labelRecord.name} added`,
      label: labelRecord
    };
    return payload;
  }

  /**
   * @desc    Edit a Label
   * @returns {string} payload.msg
   * @param   {string} userId // User who owns the Categories
   * @param   {string} labelId // ID of the Label in question
   * @param   {object} labelUpdates // { name, color }
   */
  async editLabel (userId, labelId, labelUpdates) {
    const { labelModel } = this;

    const labelRecord = await labelModel.findOneAndUpdate({
      _id: labelId,
      owner: userId
    }, { $set: labelUpdates }, { new: true });

    if (!labelRecord) {
      throw new ServiceError(404, [
        { msg: "Label not found" }
      ]);
    }

    const payload = {
      msg: "Label updated",
      label: labelRecord
    };
    return payload;
  }

  /**
   * @desc    Delete a Label
   * @returns {string} payload.msg
   * @param   {string} userId // User who owns the Categories
   * @param   {string} labelId // ID of the Label in question
   */
  async deleteLabel (userId, labelId) {
    const { labelModel } = this;

    await labelModel.findOneAndDelete({ _id: labelId, owner: userId });

    const payload = {
      msg: "Label deleted"
    };
    return payload;
  }

  /**
   * @desc    Edit a Category
   * @returns {string} payload.msg
   * @param   {string} userId // User who owns the Categories
   * @param   {string} categoryId // ID of this Category
   * @param   {object} categoryUpdates // { name }
   */
  async editCategory (userId, categoryId, categoryUpdates) {
    const { categoryModel } = this;

    const categoryRecord = await categoryModel.findOneAndUpdate({
      _id: categoryId,
      owner: userId
    }, { $set: categoryUpdates }, { new: true });

    if (!categoryRecord) {
      throw new ServiceError(404, [
        { msg: "Category not found" }
      ]);
    }

    const payload = {
      msg: "Category updated",
      category: categoryRecord
    };
    return payload;
  }

  /**
   * @desc    Delete a Category
   * @returns {string} payload.msg
   * @param   {string} userId // User who owns the Category
   * @param   {string} categoryId
   */
  async deleteCategory (userId, categoryId) {
    const { categoryModel } = this;

    await categoryModel.findOneAndDelete({ _id: categoryId, owner: userId });

    const payload = {
      msg: "Category deleted"
    };
    return payload;
  }
}

module.exports = CategoriesService;
