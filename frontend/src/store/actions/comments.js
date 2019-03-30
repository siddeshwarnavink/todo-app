import * as actionTypes from "./actionTypes";
import axios from "../../axios";

// Sync
export const commentsStart = () => ({
  type: actionTypes.COMMENTS_START
});

export const commentsSuccess = comments => ({
  type: actionTypes.COMMENTS_SUCCESS,
  comments
});

export const commentsFailed = error => ({
  type: actionTypes.COMMENTS_FAILED,
  error
});

export const commentsLoading = () => ({
  type: actionTypes.COMMENTS_LOADING
});

export const addComment = comment => ({
  type: actionTypes.ADD_COMMENT,
  comment
});

// Async
export const initComments = (type, payload) => dispatch => {
  dispatch(commentsStart());

  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
          {
              comments(type: "task", payload: 12) {
                message
                creator {
                  id
                  username
                }
                created_at
              }
          }
    `
      })
    )
    .then(({ data }) => {
      dispatch(commentsSuccess(data.data.comments));
    })
    .catch(e => {
      dispatch(commentsFailed(e));
    });
};

export const postComment = (message, type, payload) => (dispatch, getState) => {
  dispatch(commentsLoading());

  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
          mutation {
            postComment(message: "${message}", type: "${type}", payload: ${payload})
          }
        `
      })
    )
    .then((data) => {
      console.log(data);
      dispatch(
        addComment({
          message: message,
          creator: {
            id: getState().auth.user.id,
            username: "You"
          },
          created_at: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        })
      );
    });
};
