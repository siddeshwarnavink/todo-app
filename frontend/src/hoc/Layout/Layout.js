import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import classes from "./Layout.module.css";
import axios from "../../axios";

import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import FlasNotify from "../../components/FlashNotify/FlashNotify";

class Layout extends Component {
  state = {
    notificationCount: 0
  };

  componentWillReceiveProps() {
    if (this.props.isLoggedIn) {
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
            if (this.state.notificationCount !== data.data.notificationCount) {
              this.setState({ notificationCount: data.data.notificationCount });
            }
          });
      }, 3500);
    }
  }

  render() {
    return (
      <>
        <Toolbar
          isLoggedIn={this.props.isLoggedIn}
          isAdmin={this.props.isAdmin}
          logo={this.props.logo}
          userId={this.props.userId}
          notificationCount={this.state.notificationCount}
        />
        <div>{this.props.children}</div>

        <div className={classes.FlasNotifyArea}>
          {this.props.notifyMessages.map((message, i) => (
            <FlasNotify key={i}>{message.message}</FlasNotify>
          ))}
        </div>
      </>
    );
  }
}
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
)(Layout);
