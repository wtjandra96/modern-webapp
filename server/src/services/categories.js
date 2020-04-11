const ServiceError = require("../utils/errors/serviceError");

class CategoriesService {
  constructor (container) {
    this.categoryModel = container.get("CategoryModel");
    this.labelModel = container.get("LabelModel");
  }

  /**
   * @desc    Create a new Category
   * @returns {object}
   * {
   *   message: string,
   *   category: {
   *     owner: ObjectId,
   *     name: string
   *   }
   * }
   *
   * @returns {object} payload.category
   * @param   {ObjectId} userId User who created the Category
   * @param   {string} name
   */
  async create (userId, name) {
    const { categoryModel } = this;

    const categoryRecord = await categoryModel.create({
      owner: userId,
      name
    });

    const payload = {
      message: "Category created",
      category: categoryRecord
    };
    return payload;
  }

  /**
   * @desc    Add a Label to a Category
   * @returns {object}
   * {
   *   message: string,
   *   label: {
   *     owner: ObjectId,
   *     category: ObjectId,
   *     name: string
   *     color: string,
   *     checked: boolean
   *   }
   * }
   *
   * @param   {ObjectId} userId User who owns the Categories
   * @param   {ObjectId} categoryId ID of this Category
   * @param   {object} label { name: string, color: string }
   */
  async addLabel (userId, categoryId, label) {
    const { categoryModel, labelModel } = this;

    const categoryRecord = await categoryModel.findOne({ _id: categoryId, owner: userId }).lean();
    if (!categoryRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Category not found" }
      ]);
    }

    const labelRecord = await labelModel.create({
      owner: userId,
      category: categoryId,
      ...label
    });

    const payload = {
      message: `Label ${labelRecord.name} added`,
      label: labelRecord
    };
    return payload;
  }

  /**
   * @desc    Get all Categories by User
   * @returns {object}
   * {
   *   message: string,
   *   categories: [{
   *     owner: ObjectId,
   *     name: string
   *   }]
   * }
   *
   * @param   {ObjectId} userId User who owns the Categories
   */
  async getCategories (userId) {
    const { categoryModel } = this;

    const categoryRecords = await categoryModel.find({ owner: userId });

    const payload = {
      message: "Categories retrieved",
      categories: categoryRecords
    };
    return payload;
  }

  /**
   * @desc    Get all Labels of a Category
   * @returns {object}
   * {
   *   message: string,
   *   labels: [{
   *     owner: ObjectId,
   *     category: ObjectId,
   *     name: string
   *     color: string,
   *     checked: boolean
   *   }]
   * }
   *
   * @param   {ObjectId} userId User who owns the Categories
   * @param   {ObjectId} categoryId The Category in question
   */
  async getLabels (userId, categoryId) {
    const { labelModel } = this;

    const labelRecords = await labelModel.find({ owner: userId, category: categoryId });
    const payload = {
      message: "Labels retrieved",
      labels: labelRecords
    };
    return payload;
  }

  /**
   * @desc    Edit a Category
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Categories
   * @param   {ObjectId} categoryId ID of this Category
   * @param   {object} categoryUpdates { name: string }
   */
  async editCategory (userId, categoryId, categoryUpdates) {
    const { categoryModel } = this;

    const categoryRecord = await categoryModel.findOneAndUpdate({
      _id: categoryId,
      owner: userId
    }, { $set: categoryUpdates });

    if (!categoryRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Category not found" }
      ]);
    }

    const payload = {
      message: "Category updated"
    };
    return payload;
  }

  /**
   * @desc    Edit a Label
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Categories
   * @param   {ObjectId} labelId ID of the Label in question
   * @param   {object} labelUpdates { name: string, color: string }
   */
  async editLabel (userId, labelId, labelUpdates) {
    const { labelModel } = this;

    const labelRecord = await labelModel.findOneAndUpdate({
      _id: labelId,
      owner: userId
    }, { $set: labelUpdates });

    if (!labelRecord) {
      throw new ServiceError(404, [
        { errorMessage: "Label not found" }
      ]);
    }

    const payload = {
      message: "Label updated"
    };
    return payload;
  }

  /**
   * @desc    Delete a Category
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Category
   * @param   {ObjectId} categoryId
   */
  async deleteCategory (userId, categoryId) {
    const { categoryModel } = this;

    await categoryModel.findOneAndDelete({ _id: categoryId, owner: userId });

    const payload = {
      message: "Category deleted"
    };
    return payload;
  }

  /**
   * @desc    Delete a Label
   * @returns {object} { message: string }
   * @param   {ObjectId} userId User who owns the Categories
   * @param   {ObjectId} labelId ID of the Label in question
   */
  async deleteLabel (userId, labelId) {
    const { labelModel } = this;

    await labelModel.findOneAndDelete({ _id: labelId, owner: userId });

    const payload = {
      message: "Label deleted"
    };
    return payload;
  }
}

module.exports = CategoriesService;
