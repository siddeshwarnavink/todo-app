import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  loading: false,
  notifications: []
};

const notificationStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    notifications: []
  });
};

const notificationSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    notifications: action.notifications
  });
};

const clearNotifications = (state, actions) => {
  return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION_START:
      return notificationStart(state, action);

    case actionTypes.NOTIFICATION_SUCCESS:
      return notificationSuccess(state, action);

    case actionTypes.CLEAR_NOTIFICATIONS:
      return clearNotifications(state, action);

    default:
      return state;
  }
};

export default reducer;
