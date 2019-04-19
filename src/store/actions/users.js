import * as actionTypes from "./actionTypes";
import axios from "../../axios";

import * as actions from "./";

// Sync
export const userStart = () => ({
  type: actionTypes.USER_START
});

export const userSuccess = user => ({
  type: actionTypes.USER_SUCCESS,
  user
});

export const userFailed = error => ({
  type: actionTypes.USER_FAILED,
  error
});

// Async
export const initUser = userId => dispatch => {
  dispatch(userStart());

  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
          {
            user(id: ${userId}) {
              username,
              isAdmin
            }
          }
        `
      })
    )
    .then(({ data }) => {
      dispatch(userSuccess(data.data.user));
    })
    .catch(error => {
      dispatch(userFailed(error));
      dispatch(actions.notify({ messge: "Failed to load the user!" }));
    });
};
