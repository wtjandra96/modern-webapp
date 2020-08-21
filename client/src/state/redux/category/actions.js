import * as types from "./types";

const addNewCategory = (category) => ({
  type: types.ADD_NEW_CATEGORY,
  payload: category
});

const removeCategory = categoryId => ({
  type: types.REMOVE_CATEGORY,
  payload: categoryId
});

const setCategoriesList = (categories) => ({
  type: types.SET_CATEGORIES_LIST,
  payload: categories
});

const clearCategoriesList = () => ({
  type: types.CLEAR_CATEGORIES_LIST
});


const updateCategoriesList = () => ({
  type: types.UPDATE_CATEGORIES_LIST
});

const setErrors = (errorMessages) => ({
  type: types.SET_CATEGORY_ERRORS,
  payload: errorMessages
});

const clearErrors = () => ({
  type: types.CLEAR_ERRORS
});

const updateCategory = category => ({
  type: types.UPDATE_CATEGORY,
  payload: category
});

export {
  addNewCategory,
  setCategoriesList,
  clearCategoriesList,
  updateCategoriesList,
  removeCategory,
  setErrors,
  clearErrors,
  updateCategory
};
