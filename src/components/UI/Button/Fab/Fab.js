import React from "react";

import classes from "./Fab.module.css";

const Fab = props => (
  <button
    className={classes.Fab}
    onClick={props.clicked}
    tooltip={props.ToolTip}
  >
    {props.children}
  </button>
);

export default Fab;
