import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";

import Spinner from "../../components/UI/Spinner/Spinner";
import Backdrop from "../../components/UI/Backdrop/Backdrop";

const authRequired = WrapperComponent => {
  class InnerComponent extends Component {
    componentDidMount() {
      if (!this.props.isLoggedIn) this.props.autoLogin();

      if (!localStorage.getItem("token") && !this.props.isLoggedIn) {
        this.props.history.push("/auth");
      }
    }

    render() {
      return !this.props.isLoggedIn ? (
        <>
          <Backdrop />
          <Spinner />
        </>
      ) : (
        <WrapperComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn
  });

  const mapDispatchToProps = dispatch => ({
    autoLogin: () => dispatch(actions.isLoggedIn())
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(InnerComponent);
};

export default authRequired;
