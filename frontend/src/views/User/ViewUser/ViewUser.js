import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../../../axios";
import classes from "./ViewUser.module.css";

import * as actions from "../../../store/actions";

import authRequired from "../../../hoc/authRequired/authRequired";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import Modal from "../../../components/UI/Modal/Modal";
import EditUser from "../../../components/Users/EditUser/EditUser";

class ViewUser extends Component {
  state = {
    loading: true,
    user: {},
    showEditModal: false
  };

  toggleEditModalHandler = () => {
    this.setState(prvState => ({
      showEditModal: !prvState.showEditModal
    }));
  };

  render() {
    return !this.props.loading ? (
      <main className={classes.ViewUser}>
        <h1 className={classes.Title}>
          {this.state.user.username}
          {this.state.user.isAdmin && (
            <i className="material-icons">star_rate</i>
          )}
        </h1>
        {(this.props.currentUser.isAdmin ||
          Number(this.props.match.params.id) === this.props.currentUser.id) && (
          <Button btnType="Primary" clicked={this.toggleEditModalHandler}>
            EDIT PROFILE
          </Button>
        )}
        {Number(this.props.match.params.id) === this.props.currentUser.id && (
          <Button
            btnType="Secondary"
            clicked={() => this.props.logoutHandler(this.props.history.push)}
          >
            LOGOUT
          </Button>
        )}

        <Modal
          size={this.props.currentUser.isAdmin ? 4.0 : 3.0}
          scroll={false}
          show={this.state.showEditModal}
          modalClosed={this.toggleEditModalHandler}
        >
          {this.state.user.username && (
            <EditUser
              notifyFunc={this.props.notify}
              pushFunc={this.props.history.push}
              reAuthFunc={this.props.reAuth}
              userId={this.props.match.params.id}
              currentUser={this.state.user}
              isAdmin={this.props.currentUser.isAdmin}
            />
          )}
        </Modal>
      </main>
    ) : (
      <Spinner />
    );
  }

  componentDidMount() {
    this.setState({ loading: true });

    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
          {
            user(id: ${this.props.match.params.id}) {
              username,
              isAdmin
            }
          }
        `
        })
      )
      .then(({ data }) => {
        this.setState({
          loading: false,
          user: data.data.user
        });
      })
      .catch(err => {
        alert("Error in loading the user!");
      });
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  logoutHandler: goFunc => dispatch(actions.logout(goFunc)),
  reAuth: () => dispatch(actions.auth(actions.isLoggedIn())),
  notify: message => dispatch(actions.notify({ message: message }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(authRequired(ViewUser));
