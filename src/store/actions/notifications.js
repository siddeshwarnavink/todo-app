import * as actionTypes from "./actionTypes";
import axios from "../../axios";

// Sync
const notificationStart = () => ({
  type: actionTypes.NOTIFICATION_START
});

const notificationSuccess = notifications => ({
  type: actionTypes.NOTIFICATION_SUCCESS,
  notifications
});

const clearNotifications = () => ({
  type: actionTypes.CLEAR_NOTIFICATIONS
});

// Async
export const initNotifications = () => dispatch => {
  dispatch(notificationStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
            notifications {
                icon
                message
                link
            }
        }
      `
      })
    )
    .then(({ data }) => {
      dispatch(notificationSuccess(data.data.notifications));
    });
};

export const onClearNotifications = () => dispatch => {
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        mutation {
          clearNotifications
        }
    `
      })
    )
    .then(() => {
      dispatch(clearNotifications());
      dispatch(initNotifications());
    });
};
