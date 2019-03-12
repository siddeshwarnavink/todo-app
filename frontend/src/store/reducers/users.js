import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  user: {},
  loading: false,
  error: null
};

const userStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    user: {},
    error: null
  });
};

const userSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    user: action.user,
    error: null
  });
};

const userFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    user: {},
    error: action.error
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_START:
      return userStart(state, action);

    case actionTypes.USER_SUCCESS:
      return userSuccess(state, action);

    case actionTypes.USER_FAILED:
      return userFailed(state, action);

    default:
      return state;
  }
};

export default reducer;
