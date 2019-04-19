import React from "react";

const Checkbox = props => (
  <input
    type="checkbox"
    value={props.value}
    checked={props.checked}
    onChange={props.onChange}
  />
);

export default Checkbox;
