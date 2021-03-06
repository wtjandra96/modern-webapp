import * as api from "../../../utils/api";
import * as actions from "./actions";
import { postActions } from "../post";

import localForage from "localforage";
import uuid from "react-uuid";

const createCategory = (categoryName, color, isGuest) => async (dispatch) => {
  const { addNewCategory, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  let errors = {};
  errors.base = {};
  if (!categoryName || categoryName.length === 0) {
    errors.base.name = ["Category name is required"];
  }
  if (errors.base.name) {
    dispatch(setErrors(errors));
    return;
  }

  if (!color || color.length === 0) {
    color = "#FFFFFF";
  }

  if (isGuest) {
    let categories = await localForage.getItem("categories");
    if (!categories || !(categories instanceof Array)) {
      categories = [];
    }
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      if (category.name === categoryName) {
        errors.base.name = ["Category already exists"];
        dispatch(setErrors(errors));
        return;
      }
    }
    let category = {};
    category.name = categoryName;
    category.color = color;
    category.id = uuid();
    dispatch(addNewCategory(category));
    categories.push(category);
    localForage.setItem("categories", categories);
  } else {
    const url = "/categories/createCategory";
    const data = { name: categoryName, color };

    try {
      const res = await api.post(url, data);
      const { category } = res.data;
      dispatch(addNewCategory(category));
    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        errors.base = errorMessages; 
        dispatch(setErrors(errors));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    }
  }
};

const editCategory = (categoryId, categoryName, color, isGuest) => async (dispatch) => {
  const { updateCategory, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  let errors = {};
  errors[categoryId] = {};
  if (!categoryName || categoryName.length === 0) {
    errors[categoryId].name = ["Category name is required"];
  }
  if (errors[categoryId].name) {
    dispatch(setErrors(errors));
    return;
  }

  if (!color || color.length === 0) {
    color = "#EEEEEE";
  }

  if (isGuest) {
    let categories = await localForage.getItem("categories");
    if (!categories || !(categories instanceof Array)) {
      categories = [];
    }
    if (!categories || !(categories instanceof Array)) {
      categories = [];
    }
    let categoryToUpdate = null;
    let categoryToUpdateIndex = -1;
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      if (category.name === categoryName) {
        dispatch(setErrors({
          categoryId: {
            name: ["Category already exists"]
          }
        }));
        return;
      }
      if (category.id === categoryId) {
        categoryToUpdate = category;
        categoryToUpdateIndex = i;
      }
    }
    if (categoryToUpdateIndex !== -1) {
      categoryToUpdate.name = categoryName;
      categoryToUpdate.color = color;
      dispatch(updateCategory(categoryToUpdate));
      categories[categoryToUpdateIndex] = categoryToUpdate;
      localForage.setItem("categories", categories);
    }
  } else {
    const url = "/categories/editCategory";
    const data = {
      categoryId,
      categoryUpdates: {
        name: categoryName, color
      }
    };

    try {
      const res = await api.post(url, data);
      const { category } = res.data;
      category.name = categoryName;
      category.color = color;
      dispatch(updateCategory(category));
    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors({ categoryId: errorMessages }));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    }
  }
};

const getCategories = (isGuest) => async (dispatch) => {
  const { setCategoriesList, setErrors } = actions;

  if (isGuest) {
    let categories = await localForage.getItem("categories");
    if (!categories || !(categories instanceof Array)) {
      categories = [];
      localForage.setItem("categories", categories);
    }
    dispatch(setCategoriesList(categories));
  } else {
    const url = "/categories/getCategories";

    try {
      const res = await api.get(url);
      const { categories } = res.data;
      dispatch(setCategoriesList(categories));
    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors({ base: errorMessages }));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    }
  }
};

const deleteCategory = (categoryId, isGuest) => async dispatch => {
  const { removeCategory, setErrors } = actions;

  if (isGuest) {
    dispatch(removeCategory(categoryId));
    let categories = await localForage.getItem("categories");
    if (!categories || !(categories instanceof Array)) {
      categories = [];
    }
    categories = categories.filter(category => category.id !== categoryId);
    localForage.setItem("categories", categories);

    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
    }
    posts = posts.filter(post => post.category.id !== categoryId);
    localForage.setItem("posts", posts);
  } else {
    const url = `/categories/deleteCategory/${categoryId}`;

    try {
      await api.del(url);
      dispatch(removeCategory(categoryId));
    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors({ base: errorMessages }));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    }
  }

  dispatch(postActions.removePostsOfDeletedCategory(categoryId));
};

export {
  createCategory,
  getCategories,
  deleteCategory,
  editCategory
};
