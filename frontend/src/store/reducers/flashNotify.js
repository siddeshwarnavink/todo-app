import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  messages: []
};

const addFlashMessage = (state, action) => {
  return updateObject(state, {
    messages: [action.message, ...state.messages]
  });
};

const removeFlashMessage = (state, action) => {
  let mess = [...state.messages];
  mess.splice(-1, 1);

  return updateObject(state, {
    messages: mess
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_FLASH_MESSAGE:
      return addFlashMessage(state, action);

    case actionTypes.REMOVE_FLASH_MESSAGE:
      return removeFlashMessage(state, action);

    default:
      return state;
  }
};

export default reducer;
