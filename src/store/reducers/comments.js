import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  loading: false,
  error: null,
  comments: []
};

const commentsStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
    comments: []
  });
};

const commentsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    comments: action.comments
  });
};

const commentsFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    comments: []
  });
};

const commentsLoading = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const addComment = (state, action) => {
  let comments = [...state.comments];
  comments.unshift(action.comment);

  return updateObject(state, {
    loading: false,
    error: null,
    comments
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COMMENTS_START:
      return commentsStart(state, action);

    case actionTypes.COMMENTS_SUCCESS:
      return commentsSuccess(state, action);

    case actionTypes.COMMENTS_FAILED:
      return commentsFailed(state, action);

    case actionTypes.COMMENTS_LOADING:
      return commentsLoading(state, action);

    case actionTypes.ADD_COMMENT:
      return addComment(state, action);

    default:
      return state;
  }
};

export default reducer;
