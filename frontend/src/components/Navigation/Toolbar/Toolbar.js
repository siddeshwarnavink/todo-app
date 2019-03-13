import React from "react";

import { Link } from "react-router-dom";

import classes from "./Toolbar.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const Toolbar = props => (
  <header className={classes.Toolbar}>
    <div className={classes.Logo}>
      <Link to="/">
        {props.logo ? (
          <img src={props.logo} className={classes.LogoImg} alt="Logo" />
        ) : (
          <>Siddeshrocks Todo</>
        )}
      </Link>
    </div>

    <div className={classes.Spacer} />

    <div className={classes.Navigation}>
      <ul>
        {props.isLoggedIn && (
          <>
            <NavigationItem to="/notification" badge={props.notificationCount}>
              <i className="material-icons">notifications_none</i>
            </NavigationItem>
            <NavigationItem to="/profile">
              <i className="material-icons">person</i>
            </NavigationItem>
          </>
        )}
        {props.isAdmin && (
          <NavigationItem to="/admin" selected>
            <i className="material-icons">security</i>
          </NavigationItem>
        )}
      </ul>
    </div>
  </header>
);

export default Toolbar;
