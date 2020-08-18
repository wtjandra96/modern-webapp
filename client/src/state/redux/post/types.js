/*
Let's start from defining the constants we will use as redux action types.
Let's call the file types.js, because constants.js is a bit too generic.
*/

const ADD_NEW_POST = "ADD_NEW_POST";
const SET_POSTS_LIST = "SET_POSTS_LIST";
const UPDATE_POST = "UPDATE_POST";
const CLEAR_POSTS = "CLEAR_POSTS";
const REMOVE_POST = "REMOVE_POST";
const SET_ERRORS = "SET_ERRORS";
const CLEAR_ERRORS = "CLEAR_ERRORS";
const REMOVE_POSTS_OF_DELETED_CATEGORY = "REMOVE_POSTS_OF_DELETED_CATEGORY";

export {
  ADD_NEW_POST,
  UPDATE_POST,
  SET_POSTS_LIST,
  CLEAR_POSTS,
  REMOVE_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  REMOVE_POSTS_OF_DELETED_CATEGORY
};
