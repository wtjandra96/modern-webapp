import * as api from "../../../utils/api";
import * as actions from "./actions";

import localForage from "localforage";
import uuid from "react-uuid";

const extractHostname = url => {
  let hostname;
  // http prefix
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  // Remove port number
  hostname = hostname.split(":")[0];
  // Remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};

const getPosts = (categoryId, isGuest) => async (dispatch) => {
  const { setPostsList, clearPosts, setErrors, clearErrors } = actions;
  const { startAction, stopAction } = actions;
  dispatch(startAction());
  dispatch(clearPosts());
  dispatch(clearErrors());

  if (isGuest) {
    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
      await localForage.setItem("posts", posts);
    }
    if (categoryId) {
      posts = posts.filter(post => post.category.id === categoryId);
    }
    dispatch(setPostsList(posts));
    dispatch(stopAction());
  } else {
    let url = "/posts/getPosts";
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }

    try {
      const res = await api.get(url);
      const { posts } = res.data;
      dispatch(setPostsList(posts));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
    } finally {
      dispatch(stopAction());
    }
  }
};

const getBookmarkedPosts = (isGuest) => async (dispatch) => {
  const { setPostsList, clearPosts, setErrors, clearErrors } = actions;
  const { startAction, stopAction } = actions;
  dispatch(startAction());
  dispatch(clearPosts());
  dispatch(clearErrors());

  if (isGuest) {
    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
      await localForage.setItem("posts", posts);
    }
    let bookmarkedPosts = [];
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.isBookmarked) {
        bookmarkedPosts.push(post);
      }
    }
    dispatch(setPostsList(bookmarkedPosts));
    dispatch(stopAction());
  } else {
    let url = "/posts/getBookmarkedPosts";

    try {
      const res = await api.get(url);
      const { posts } = res.data;
      dispatch(setPostsList(posts));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors({ base: errorMessages }));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    } finally {
      dispatch(stopAction());
    }
  }
};

const bookmarkPost = (postId, isNowBookmarked, isGuest) => async (dispatch) => {
  const { updatePostBookmark, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  if (isGuest) {
    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
    }
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.id === postId) {
        post.isBookmarked = isNowBookmarked;
        dispatch(updatePostBookmark(postId, isNowBookmarked));
        posts[i] = post;
        break;
      }
    }
    localForage.setItem("posts", posts);
  } else {
    let url = "/posts/bookmarkPost";
    const data = {
      postId,
      isNowBookmarked
    };
    try {
      await api.post(url, data);
      dispatch(updatePostBookmark(postId, isNowBookmarked));
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

const editPost = (postId, postTitle, postUrl, category, isGuest) => async (dispatch) => {
  const { updatePost, setErrors, clearErrors, startAction, stopAction } = actions;
  dispatch(clearErrors());
  dispatch(startAction());

  let errors = {};
  if (!postId) {
    dispatch(setErrors(errors.title = ["Invalid request"]));
    dispatch(stopAction());
    return;
  }

  errors[postId] = {};
  if (!postTitle || postTitle.length === 0) {
    const errorMessage = "Post title is required";
    errors[postId].title = [errorMessage];
  }

  if (!postUrl || postUrl.length === 0) {
    const errorMessage = "Post url is required";
    errors[postId].url = [errorMessage];
  }
  if (errors[postId].title || errors[postId].url) {
    dispatch(setErrors(errors));
    dispatch(stopAction());
    return;
  }

  if (isGuest) {
    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
    }
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.id === postId) {
        post.title = postTitle;
        post.url = postUrl;
        post.source = extractHostname(postUrl);
        dispatch(updatePost(post));
        posts[i] = post;
        break;
      }
    }
    localForage.setItem("posts", posts);
    dispatch(stopAction());
  } else {
    const url = "/posts/editPost";
    const data = {
      postId, title: postTitle, url: postUrl
    };

    try {
      const res = await api.post(url, data);
      const { post } = res.data;
      post.category = category;
      dispatch(updatePost(post));

    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        errors = { postId: errorMessages };
        dispatch(setErrors(errors));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    } finally {
      dispatch(stopAction());
    }
  }
};

const createPost = (categoryId, categoryName, postTitle, postUrl, isGuest) => async (dispatch) => {
  const { addNewPost, setErrors, clearErrors, startAction, stopAction } = actions;
  dispatch(clearErrors());
  dispatch(startAction());

  let errors = {};
  errors.base = {};
  if (!postTitle || postTitle.length === 0) {
    errors.base.title = ["Post title is required"];
  }

  if (!postUrl || postUrl.length === 0) {
    errors.base.url = ["Post url is required"];
  }
  if (errors.base.title || errors.base.url) {
    dispatch(setErrors(errors));
    dispatch(stopAction());
    return;
  }

  if (isGuest) {

    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
    }
    let post = {};
    post.category = {};
    post.category.id = categoryId;
    post.category.name = categoryName;
    post.title = postTitle;
    post.url = postUrl;
    post.id = uuid();
    post.source = extractHostname(postUrl);
    post.isBookmarked = false;
    post.updatedAt = new Date();
    dispatch(addNewPost(post));
    posts.push(post);
    localForage.setItem("posts", posts);
    dispatch(stopAction());
  } else {
    const url = "/posts/createPost";
    const data = {
      categoryId,
      title: postTitle,
      url: postUrl
    };

    try {
      const res = await api.post(url, data);
      const { post } = res.data;
      dispatch(addNewPost(post));

    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors({ base: errorMessages }));
      } else {
        dispatch(setErrors({ misc: err }));
      }
    } finally {
      dispatch(stopAction());
    }
  }
};

const deletePost = (postId, isGuest) => async (dispatch) => {
  const { setErrors, clearErrors, removePost } = actions;
  dispatch(clearErrors());

  if (isGuest) {
    dispatch(removePost(postId));
    let posts = await localForage.getItem("posts");
    if (!posts || !(posts instanceof Array)) {
      posts = [];
    }
    posts = posts.filter(post => post.id !== postId);
    localForage.setItem("posts", posts);
  } else {

    const url = `/posts/deletePost/${postId}`;

    try {
      await api.del(url);
      dispatch(removePost(postId));
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

const clear = () => (dispatch) => {
  const { clearPosts } = actions;
  dispatch(clearPosts());
};

export {
  createPost,
  getPosts,
  getBookmarkedPosts,
  clear,
  editPost,
  deletePost,
  bookmarkPost
};
