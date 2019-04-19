import * as actionTypes from "./actionTypes";
// Sync
const addFlashMessage = message => ({
  type: actionTypes.ADD_FLASH_MESSAGE,
  message
});

const removeFlashMessage = () => ({
  type: actionTypes.REMOVE_FLASH_MESSAGE
});

// Async
export const notify = message => dispatch => {
  dispatch(addFlashMessage(message));

  setTimeout(() => {
    dispatch(removeFlashMessage());
  }, 3000);
};
