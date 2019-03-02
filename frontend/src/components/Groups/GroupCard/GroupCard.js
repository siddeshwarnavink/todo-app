import React from "react";

import { Link } from "react-router-dom";

import classes from "./GroupCard.module.css";

const GroupCard = props => (
  <div className={classes.GroupCard}>
    <Link to={`group/${props.id}`}>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </Link>
  </div>
);

export default GroupCard;
