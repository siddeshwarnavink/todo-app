import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  error: false,
  loading: false,
  token: "",
  isLoggedIn: false,
  user: {}
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: true
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: false,
    token: action.token,
    isLoggedIn: true,
    user: action.user
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: "",
    isLoggedIn: false,
    user: {}
  })
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_FAIL:
      return authFail(state, action);

    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);

    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    default:
      return state;
  }
};

export default reducer;
