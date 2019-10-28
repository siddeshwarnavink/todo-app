import React from "react";

export default React.createContext({
  selected: [],
  payload: '',
  onSelect: (key, payload) => {},
  onClear: () => {},
  onDelete: () => {},
  onComplete: () => {},
  onUnSelect: () => {}
});
