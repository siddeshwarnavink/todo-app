import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import classes from "./Layout.module.css";

import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import FlasNotify from "../../components/FlashNotify/FlashNotify";

class Layout extends Component {
  render() {
    return (
      <>
        <Toolbar
          isLoggedIn={this.props.isLoggedIn}
          isAdmin={this.props.isAdmin}
          logo={this.props.logo}
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
