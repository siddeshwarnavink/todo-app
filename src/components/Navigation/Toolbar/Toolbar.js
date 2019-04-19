import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import NavigationItem from "./NavigationItem/NavigationItem";
import NotificationContext from "../../../context/notification-context";
import MenuContext from "../../../context/menu-context";
import classNames from "classnames";
import classes from "./Toolbar.module.css";

const Toolbar = props => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuContext = useContext(MenuContext);

  return (
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
          <MobileView>
            {props.isLoggedIn && (
              <>
                <button
                  className={classNames(classes.MobileMore, {
                    [classes.Selected]: isMoreOpen
                  })}
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                >
                  <i className="material-icons">
                    {isMoreOpen ? "close" : "more_vert"}
                  </i>
                </button>

                {isMoreOpen && (
                  <div
                    className={classes.Dropdown}
                    onClick={() => setIsMoreOpen(false)}
                  >
                    {menuContext.menuItems.map((menuItem, index) => (
                      <Link
                        to={menuItem.to}
                        key={index}
                        onClick={menuItem ? menuItem.clicked : () => {}}
                      >
                        <i className="material-icons">{menuItem.icon}</i>
                        {menuItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </MobileView>
          <BrowserView>
            {props.isLoggedIn && (
              <>
                <NotificationContext.Consumer>
                  {value => {
                    return (
                      <NavigationItem
                        to="/notification"
                        badge={props.notificationCount}
                      >
                        <i className="material-icons">notifications_none</i>
                      </NavigationItem>
                    );
                  }}
                </NotificationContext.Consumer>
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
          </BrowserView>
        </ul>
      </div>
    </header>
  );
};

export default Toolbar;
