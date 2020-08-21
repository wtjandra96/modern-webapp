import * as types from "./types";

const initialState = {
  postsList: [],
  errors: {},
  currentlyProcessing: false
};

const insertItem = (array, item) => {
  if (!array) return [item];
  return [item, ...array];
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.ADD_NEW_POST:
      return {
        ...state,
        postsList: insertItem(state.postsList, payload)
      };
    case types.SET_POSTS_LIST:
      return {
        ...state,
        postsList: payload
      };
    case types.UPDATE_POST:
      return {
        ...state,
        postsList: state.postsList.reduce((posts, post) => {
          if (post.id === payload.id) {
            posts.push(payload);
          } else {
            posts.push(post);
          }
          return posts;
        }, [])
      };
    case types.UPDATE_POST_BOOKMARK:
      return {
        ...state,
        postsList: state.postsList.reduce((posts, post) => {
          if (post.id === payload.id) {
            posts.push({...post, isBookmarked: payload.isNowBookmarked});
          } else {
            posts.push(post);
          }
          return posts;
        }, [])
      }
    case types.REMOVE_POST:
      return {
        ...state,
        postsList: state.postsList.filter(post => post.id !== payload)
      };
    case types.REMOVE_POSTS_OF_DELETED_CATEGORY:
      return {
        ...state,
        postsList: state.postsList.filter(post => {
          if (post.category.id) {
            return post.category.id !== payload
          }
          return post.category._id !== payload
        })
      }
    case types.CLEAR_POSTS:
      return {
        ...state,
        postsList: []
      };
    case types.SET_POST_ERRORS:
      return {
        ...state,
        errors: payload
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        errors: {}
      }
    case types.START_POST_ACTION:
      return {
        ...state,
        currentlyProcessing: true
      }
    case types.STOP_POST_ACTION:
      return {
        ...state,
        currentlyProcessing: false
      }
    default:
      return state;
  }
};
