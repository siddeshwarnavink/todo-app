import React from "react";

import classes from "./Jumbotron.module.css";

const Jumbotron = props => (
  <div className={classes.Jumbotron}>
    <div className={classes.Container}>{props.children}</div>
  </div>
);

export default Jumbotron;
