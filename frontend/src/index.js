import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import * as serviceWorker from "./serviceWorker";
import HttpsRedirect from "react-https-redirect";

// React Router
import { BrowserRouter } from "react-router-dom";

// Redux stuffs
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// Reducers
import flashNotifyReducer from "./store/reducers/flashNotify";
import authReducer from "./store/reducers/auth";
import groupsReducer from "./store/reducers/groups";
import tasksReducer from "./store/reducers/tasks";
import NotificationReducer from "./store/reducers/notifications";
import UsersReducer from "./store/reducers/users";

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const rootReducers = combineReducers({
  auth: authReducer,
  flashNotify: flashNotifyReducer,
  groups: groupsReducer,
  tasks: tasksReducer,
  notification: NotificationReducer,
  users: UsersReducer
});

const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      {process.env.NODE_ENV === "development" ? (
        <App />
      ) : (
        <HttpsRedirect>
          <App />
        </HttpsRedirect>
      )}
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
if (process.env.NODE_ENV !== "development") {
  serviceWorker.register();
}
