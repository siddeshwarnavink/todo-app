import React from "react";

import classes from "./MobileJumbotron.module.css";

const mobileJumbotron = props => {
  return (
    <div className={classes.MobileJumbotron}>
      <div className={classes.Title}>{props.children}</div>
      <span className={classes.Subtext}>{props.subtext}</span>
    </div>
  );
};

export default mobileJumbotron;
