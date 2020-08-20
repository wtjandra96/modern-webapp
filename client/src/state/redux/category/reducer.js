import * as types from "./types";

/**
 * categoriesList: [{
 *   id: ObjectId,
 *   owner: ObjectId,
 *   name: string
 * }]
 */
const initialState = {
  categoriesList: [],
  errors: {}
};

const insertItem = (array, item) => {
  if (!array) return [item];
  return [item, ...array];
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_NEW_CATEGORY:
      return {
        ...state,
        categoriesList: insertItem(state.categoriesList, payload)
      };
    case types.UPDATE_CATEGORY:
      return {
        ...state,
        categoriesList: state.categoriesList.reduce((categories, category) => {
          if (category.id === payload.id) {
            categories.push(payload);
          } else {
            categories.push(category);
          }
          return categories;
        }, [])
      }
    case types.SET_CATEGORIES_LIST:
    case types.UPDATE_CATEGORIES_LIST:
      return {
        ...state,
        categoriesList: payload
      };
    case types.CLEAR_CATEGORIES_LIST:
      return {
        ...state,
        categoriesList: []
      };
    case types.REMOVE_CATEGORY:
      return {
        ...state,
        categoriesList: state.categoriesList.filter(category => category.id !== payload)
      }
    case types.SET_CATEGORY_ERRORS:
      return {
        ...state,
        errors: payload
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        errors: {}
      }
    default:
      return {
        ...state
      };
  }
};
