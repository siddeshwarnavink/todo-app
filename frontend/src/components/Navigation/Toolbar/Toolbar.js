import React from "react";

import { Link } from "react-router-dom";

import classes from "./Toolbar.module.css";

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
          <li>
            <Link style={{ color: "#000" }} to="/notification">
              <i className="material-icons">notifications_none</i>
            </Link>

            <Link style={{ color: "#000" }} to="/profile">
              <i className="material-icons">person</i>
            </Link>
          </li>
        )}
        {props.isAdmin && (
          <li>
            <Link style={{ top: "10" }} to="/admin">
              <i className="material-icons">security</i>
            </Link>
          </li>
        )}
      </ul>
    </div>
  </header>
);

export default Toolbar;
