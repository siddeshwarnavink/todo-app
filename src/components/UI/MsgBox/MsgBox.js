import React from "react";
import classNames from "classnames";

import classes from "./MsgBox.module.css";

const msgBox = props => {
  return (
    <div
      className={classNames(classes.MsgBox, {
        [classes.Warning]: props.type === "warning"
      })}
    >
      <i className="material-icons">{props.type}</i>

      <span className={classes.Msg}>{props.children}</span>
    </div>
  );
};

export default msgBox;
