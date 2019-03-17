import * as actionTypes from "./actionTypes";
import * as actions from "./";
import axios from "../../axios";

// Sync
const authStart = () => ({
  type: actionTypes.AUTH_START
});

const authFail = () => ({
  type: actionTypes.AUTH_FAIL
});

const authSuccess = (token, user) => ({
  type: actionTypes.AUTH_SUCCESS,
  token,
  user
});

const authLogout = () => ({
  type: actionTypes.AUTH_LOGOUT
});

// Async
export const isLoggedIn = () => dispatch => {
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          validToken: validToken(token: "${localStorage.getItem("token")}") {
            newToken,
            user {
              id,
              isAdmin,
              company
            }
          }

          companyStaics: companyStaics {
            logo
          }
        }
      `
      })
    )
    .then(({ data }) => {
      dispatch(
        authSuccess(data.data.validToken.newToken, {
          ...data.data.validToken.user,
          logo: data.data.companyStaics.logo
        })
      );
    });
};

export const auth = (email, password) => async dispatch => {
  dispatch(authStart());

  axios
    .post(
      "/",
      JSON.stringify({
        query: `
          {
            login(email: "${email}", password: "${password}") {
              token
            }
          }
        `
      })
    )
    .then(({ data }) => {
      localStorage.setItem("token", data.data.login.token);

      dispatch(isLoggedIn());

      dispatch(
        actions.notify({
          message: "Loggedin Successfully!"
        })
      );
    })
    .catch(err => {
      dispatch(authFail());

      dispatch(
        actions.notify({
          message: "Enter a valid input"
        })
      );
    });
};

export const logout = goFunc => dispatch => {
  localStorage.removeItem("token");
  dispatch(authLogout());

  dispatch(
    actions.notify({
      message: "Logged out. See you later!"
    })
  );

  goFunc("/auth");
};
