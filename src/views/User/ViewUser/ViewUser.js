import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ViewUser.module.css';

import * as actions from '../../../store/actions';

import authRequired from '../../../hoc/authRequired/authRequired';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';
import EditUser from '../../../components/Users/EditUser/EditUser';

class ViewUser extends Component {
     state = {
          showEditModal: false,
     };

     constructor(props) {
          super(props);
          this.initUserHandler();
     }

     initUserHandler = () => {
          if (this.props.match.params.id === 'current-user') {
               this.props.initUser(this.props.currentUser.id);
          } else {
               this.props.initUser(this.props.match.params.id);
          }
     };

     toggleEditModalHandler = () => {
          this.setState(prvState => ({
               showEditModal: !prvState.showEditModal,
          }));
     };

     onEditUserHandler = () => {
          this.toggleEditModalHandler();

          this.initUserHandler();
     };

     render() {
          return !this.props.loading ? (
               <main className={classes.ViewUser}>
                    <h1 className={classes.Title}>
                         {this.props.user.username}
                         {this.props.user.isAdmin && (
                              <i className='material-icons'>star_rate</i>
                         )}
                    </h1>
                    {(this.props.currentUser.isAdmin ||
                         this.props.match.params.id === 'current-user') && (
                         <Button
                              btnType='Primary'
                              clicked={this.toggleEditModalHandler}
                         >
                              EDIT PROFILE
                         </Button>
                    )}
                    {this.props.match.params.id === 'current-user' && (
                         <Button
                              btnType='Secondary'
                              clicked={() =>
                                   this.props.logoutHandler(
                                        this.props.history.push,
                                   )
                              }
                         >
                              LOGOUT
                         </Button>
                    )}

                    <Modal
                         size={4.5}
                         show={this.state.showEditModal}
                         modalClosed={this.toggleEditModalHandler}
                         scroll
                    >
                         {this.props.user.username && (
                              <EditUser
                                   notifyFunc={this.props.notify}
                                   pushFunc={this.props.history.push}
                                   userId={this.props.match.params.id}
                                   currentUser={this.props.user}
                                   onEdit={this.onEditUserHandler}
                                   isAdmin={this.props.currentUser.isAdmin}
                                   logoutUser={() =>
                                        this.props.logoutHandler(
                                             this.props.history.push,
                                        )
                                   }
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
     user: state.users.user,
});

const mapDispatchToProps = dispatch => ({
     logoutHandler: goFunc => dispatch(actions.logout(goFunc)),
     notify: message => dispatch(actions.notify({ message: message })),
     initUser: userId => dispatch(actions.initUser(userId)),
});

export default connect(
     mapStateToProps,
     mapDispatchToProps,
)(authRequired(ViewUser));
