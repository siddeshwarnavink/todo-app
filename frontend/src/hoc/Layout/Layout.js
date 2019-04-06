import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as actions from "../../store/actions";
import classes from "./Layout.module.css";
import axios from "../../axios";

import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import FlasNotify from "../../components/FlashNotify/FlashNotify";
import NotificationContext from "../../context/notification-context";
import MenuContext from "../../context/menu-context";

const Layout = props => {
  const menuContext = useContext(MenuContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      axios
        .post(
          `/?token=${localStorage.getItem("token")}`,
          JSON.stringify({
            query: `
          {
            notificationCount
          }
          `
          })
        )
        .then(({ data }) => {
          if (notificationCount !== data.data.notificationCount) {
            setNotificationCount(data.data.notificationCount);
          }
        });
    }, 3500);
  }, []);

  useEffect(() => {
    console.log("ROUTE CHANGED");
    updateMenuHandler();
  }, [props.location, props.isLoggedIn]);

  const updateMenuHandler = () => {
    let menuItems = [];

    if (props.isLoggedIn) {
      menuItems.push({
        label: "Profile",
        icon: "person",
        to: "/profile"
      });

      if (props.isAdmin) {
        menuItems.push({
          label: "Admin Area",
          icon: "security",
          to: "/admin/"
        });
      }
    } else {
      menuItems.push({
        label: "Auth",
        icon: "person",
        to: "/auth"
      });
    }

    menuContext.setMenuItems(menuItems);
  };

  return (
    <NotificationContext.Provider value={notificationCount}>
      <Toolbar
        isLoggedIn={props.isLoggedIn}
        isAdmin={props.isAdmin}
        logo={props.logo}
        userId={props.userId}
      />
      <div>{props.children}</div>

      <div className={classes.FlasNotifyArea}>
        {props.notifyMessages.map((message, i) => (
          <FlasNotify key={i}>{message.message}</FlasNotify>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.user.id,
  isLoggedIn: state.auth.isLoggedIn,
  notifyMessages: state.flashNotify.messages,
  isAdmin: state.auth.user.isAdmin === true,
  logo: state.auth.user.logo
});

const mapDispatchToProps = dispatch => ({
  flasNotify: messages => dispatch(actions.notify(messages))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Layout));
