import * as api from "../../../utils/api";
import * as actions from "./actions";

import localForage from 'localforage';
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
}

const getPosts = (categoryId, isGuest) => async (dispatch) => {
  const { setPostsList, clearPosts, setErrors, clearErrors } = actions;
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
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
    }
  }
};

const getBookmarkedPosts = (isGuest) => async (dispatch) => {
  const { setPostsList, clearPosts, setErrors, clearErrors } = actions;
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
  } else {
    let url = "/posts/getBookmarkedPosts";

    try {
      const res = await api.get(url);
      const { posts } = res.data;
      dispatch(setPostsList(posts));
    } catch (err) {
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
    }
  }
};

const bookmarkPost = (postId, isNowBookmarked, category, isGuest) => async (dispatch) => {
  const { updatePost, setErrors, clearErrors } = actions;
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
        dispatch(updatePost(post));
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
    }
    try {
      const res = await api.post(url, data);
      const { post } = res.data;
      post.category = category;
      dispatch(updatePost(post));
    } catch (err) {
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
    }
  }
}

const editPost = (postId, postTitle, postUrl, category, isGuest) => async (dispatch) => {
  const { updatePost, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  let errors = {};
  if (!postTitle || postTitle.length === 0) {
    errors.title = ["Post title is required"];
  }

  if (!postUrl || postUrl.length === 0) {
    errors.url = ["Post url is required"];
  }
  if (errors.title || errors.url) {
    dispatch(setErrors(errors));
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
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
    }
  }
};

const createPost = (categoryId, categoryName, postTitle, postUrl, isGuest) => async (dispatch) => {
  const { addNewPost, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  let errors = {};
  if (!postTitle || postTitle.length === 0) {
    errors.title = ["Post title is required"];
  }

  if (!postUrl || postUrl.length === 0) {
    errors.url = ["Post url is required"];
  }
  if (errors.title || errors.url) {
    dispatch(setErrors(errors));
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
    post.originalDate = new Date();
    dispatch(addNewPost(post));
    posts.push(post);
    localForage.setItem("posts", posts);
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
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
      }
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
      if (err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        dispatch(setErrors(errorMessages));
      } else {
        console.error(err);
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
