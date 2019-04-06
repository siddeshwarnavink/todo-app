import React from "react";

import classes from "./TaskListItem.module.css";

import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import Swipeout from "rc-swipeout";

const TaskListItem = props => {
  let swipeMenu = [];

  if (!props.isCompleted)
    swipeMenu.push({
      text: <i className="material-icons">done</i>,
      className: classes.CompleteButton,
      onPress: props.completeTask
    });

  return (
    <CSSTransition
      timeout={300}
      classNames={{
        enter: classes.Enter,
        enterActive: classes,
        exit: classes.Exit,
        exitActive: classes.ExitActive
      }}
    >
      <Swipeout autoClose left={swipeMenu}>
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
      </Swipeout>
    </CSSTransition>
  );
};

export default TaskListItem;
