import React from "react";

import classes from "./GroupListItem.module.css";

import { Link } from "react-router-dom";

const GroupListItem = props => (
  <>
    <Link to={`/group/${props.id}`} className={classes.Link}>
      <li className={classes.GroupListItem}>{props.title}</li>
    </Link>
  </>
);

export default GroupListItem;
