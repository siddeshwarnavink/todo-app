import React from "react";

import classes from "./Notification.module.css";

const Notification = props => {
  return (
    <div className={classes.Notification}>
      <div className={classes.Icon}>
        <i className="material-icons">{props.icon}</i>
      </div>
      <div className={classes.Text}>{props.content}</div>
    </div>
  );
};

export default Notification;
