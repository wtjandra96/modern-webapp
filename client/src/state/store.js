import { createStore, applyMiddleware, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import localForage from "localforage";

import * as reducers from "./redux"; // import all reducers from redux/index.js

const userPersistConfig = {
  key: "user",
  storage: localForage,
  blacklist: ["isAuthenticated", "errors"]
}

const rootReducer = combineReducers({
  ...reducers,
  user: persistReducer(userPersistConfig, reducers.user)
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export { store };
export const persistor = persistStore(store);
