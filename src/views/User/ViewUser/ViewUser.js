import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./ViewUser.module.css";

import * as actions from "../../../store/actions";

import authRequired from "../../../hoc/authRequired/authRequired";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import Modal from "../../../components/UI/Modal/Modal";
import EditUser from "../../../components/Users/EditUser/EditUser";

class ViewUser extends Component {
  state = {
    showEditModal: false
  };

  constructor(props) {
    super(props);
    if (props.match.params.id === "current-user") {
      props.initUser(props.currentUser.id);
    } else {
      props.initUser(props.match.params.id);
    }
  }

  toggleEditModalHandler = () => {
    this.setState(prvState => ({
      showEditModal: !prvState.showEditModal
    }));
  };

  render() {
    return !this.props.loading ? (
      <main className={classes.ViewUser}>
        <h1 className={classes.Title}>
          {this.props.user.username}
          {this.props.user.isAdmin && (
            <i className="material-icons">star_rate</i>
          )}
        </h1>
        {(this.props.currentUser.isAdmin ||
          this.props.match.params.id === "current-user") && (
          <Button btnType="Primary" clicked={this.toggleEditModalHandler}>
            EDIT PROFILE
          </Button>
        )}
        {this.props.match.params.id === "current-user" && (
          <Button
            btnType="Secondary"
            clicked={() => this.props.logoutHandler(this.props.history.push)}
          >
            LOGOUT
          </Button>
        )}

        <Modal
          size={this.props.currentUser.isAdmin ? 4.5 : 3.0}
          scroll={false}
          show={this.state.showEditModal}
          modalClosed={this.toggleEditModalHandler}
        >
          {this.props.user.username && (
            <EditUser
              notifyFunc={this.props.notify}
              pushFunc={this.props.history.push}
              reAuthFunc={this.props.reAuth}
              userId={
                this.props.match.params.id === "current-user"
                  ? this.props.currentUser.id
                  : this.props.match.params.id
              }
              currentUser={this.props.user}
              isAdmin={this.props.currentUser.isAdmin}
            />
          )}
        </Modal>
      </main>
    ) : (
      <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  loading: state.users.loading,
  user: state.users.user
});

const mapDispatchToProps = dispatch => ({
  logoutHandler: goFunc => dispatch(actions.logout(goFunc)),
  reAuth: () => dispatch(actions.auth(actions.isLoggedIn())),
  notify: message => dispatch(actions.notify({ message: message })),
  initUser: userId => dispatch(actions.initUser(userId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(authRequired(ViewUser));
