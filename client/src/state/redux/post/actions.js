import * as types from "./types";

const addNewPost = (post) => ({
  type: types.ADD_NEW_POST,
  payload: post
});

const setPostsList = (posts) => ({
  type: types.SET_POSTS_LIST,
  payload: posts
});

const updatePost = (post) => ({
  type: types.UPDATE_POST,
  payload: post
});

const removePost = (postId) => ({
  type: types.REMOVE_POST,
  payload: postId
});

const clearPosts = () => ({
  type: types.CLEAR_POSTS
});

const setErrors = (errorMessages) => ({
  type: types.SET_ERRORS,
  payload: errorMessages
})

const clearErrors = () => ({
  type: types.CLEAR_ERRORS
})

const removePostsOfDeletedCategory = (categoryId) => ({
  type: types.REMOVE_POSTS_OF_DELETED_CATEGORY,
  payload: categoryId
})

export {
  addNewPost,
  updatePost,
  setPostsList,
  clearPosts,
  removePost,
  setErrors,
  clearErrors,
  removePostsOfDeletedCategory
};
