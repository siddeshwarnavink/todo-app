import React from "react";

import { Link } from "react-router-dom";

import classNames from "classnames";
import classes from "./NavigationItem.module.css";

const NavigationItem = props => {
  return (
    <li>
      <Link
        to={props.to}
        className={classNames(classes.NavigationItem, {
          [classes.Selected]: props.selected,
          [classes.Badge]: props.badge
        })}
        data-badge={props.badge}
      >
        {props.children}
      </Link>
    </li>
  );
};

export default NavigationItem;
