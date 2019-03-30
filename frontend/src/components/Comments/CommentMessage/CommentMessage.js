import React from "react";

import classNames from "classnames";
import classes from "./CommentMessage.module.css";
import { Link } from "react-router-dom";

const CommentMessage = props => {
  return (
    <div
      className={classNames(classes.CommentMessage, {
        [classes.Darker]: props.isWriterIsReader
      })}
    >
      <p>
        <Link className={classes.Link} to={`/user/${props.creator.id}`}>
          {props.isWriterIsReader ? "You" : props.creator.username}
        </Link>
        : {props.message}
      </p>
      <span
        className={
          props.isWriterIsReader ? classes.TimeLeft : classes.TimeRight
        }
      >
        {new Date(props.created_at).toDateString()}
      </span>
    </div>
  );
};

export default CommentMessage;
