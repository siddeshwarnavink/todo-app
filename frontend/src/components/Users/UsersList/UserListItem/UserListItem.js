import React from "react";

import classes from "./UserListItem.module.css";

import { Link } from "react-router-dom";

const UserListItem = props => (
  <>
    <Link to={`/user/${props.id}`} className={classes.Link}>
      <li className={classes.UserListItem}>
        {props.username}
        {props.isAdmin && <i className="material-icons">star_rate</i>}
      </li>
    </Link>
  </>
);

export default UserListItem;
