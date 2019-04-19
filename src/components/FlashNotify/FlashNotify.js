import React from "react";

import classes from "./FlashNotify.module.css";

const FlashNotify = props => (
  <div className={classes.FlashMessage}>
    <div className={classes.Content}>{props.children}</div>
  </div>
);

export default FlashNotify;
