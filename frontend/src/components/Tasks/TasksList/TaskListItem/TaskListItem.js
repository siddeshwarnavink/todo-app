import React from "react";

import classes from "./TaskListItem.module.css";

import { Link } from "react-router-dom";

const TaskListItem = props => (
  <>
    <Link to={`/task/${props.id}`} className={classes.Link}>
      <li className={classes.TaskListItem}>
        <div className={classes.DetailsDisplay}>
          <span className={classes.Title}>{props.title}</span>
          <span className={classes.Description}>{`${props.description
            .split(/\s+/)
            .slice(0, 5)
            .join(" ")}...`}</span>
        </div>
      </li>
    </Link>
  </>
);

export default TaskListItem;
