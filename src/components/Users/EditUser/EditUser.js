import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios';
import classes from './EditUser.module.css';
import checkValidation from '../../../utility/checkValidation';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';

class EditUser extends Component {
     state = {
          controls: {
               username: {
                    elementType: 'input',
                    elementConfig: {
                         label: 'Username',
                         type: 'text',
                         placeholder: 'e.g: Dr.RoX',
                    },
                    value: this.props.currentUser.username,
                    validation: {
                         required: true,
                    },
                    valid: false,
                    touched: false,
               },

               password: {
                    elementType: 'input',
                    elementConfig: {
                         label: 'New Password',
                         type: 'text',
                         placeholder: 'e.g: letmein123',
                    },
                    value: '',
                    validation: {
                         required: false,
                    },
                    valid: false,
                    touched: false,
               },
          },
     };

     componentDidMount() {
          if (this.props.isAdmin) {
               const isAdminField = {
                    elementType: 'checkbox',
                    elementConfig: {
                         label: 'Is Admin',
                    },
                    value: this.props.currentUser.isAdmin,
                    valid: true,
                    touched: true,
               };

               this.setState(prvState => ({
                    controls: {
                         ...prvState.controls,
                         isAdminField,
                    },
               }));
          }
     }

     inputChangedHandler = (event, controlName) => {
          const updatedControls = {
               ...this.state.controls,
               [controlName]: {
                    ...this.state.controls[controlName],
                    value: event.target.value,
                    valid: checkValidation(
                         event.target.value,
                         this.state.controls[controlName].validation,
                    ),
                    touched: true,
               },
          };

          this.setState({
               controls: updatedControls,
          });
     };

     submitHandler = event => {
          event.preventDefault();
          axios.post(
               `/?token=${localStorage.getItem('token')}`,
               JSON.stringify({
                    query: `
            mutation {
              editUser(userId: ${this.props.userId}, username: "${
                         this.state.controls.username.value
                    }", isAdmin:${
                         this.state.controls.isAdminField
                              ? this.state.controls.isAdminField.value
                              : null
                    }, newPassword: "${this.state.controls.password.value}") {
                username
              }
            }
          `,
               }),
          ).then(() => {
               if (
                    this.props.userId === 'current-user' &&
                    this.state.controls.password.value !== ''
               ) {
                    this.props.logoutUser();
               }
               this.props.onEdit();
               this.props.notifyFunc('User Successfully updated!');
          });
     };

     deleteUserHandler = () => {
          const verify = window.confirm(
               'Are you sure the you want to delete this user?',
          );

          if (verify) {
               axios.post(
                    `/?token=${localStorage.getItem('token')}`,
                    JSON.stringify({
                         query: `
          mutation {
            deleteUser(id: ${this.props.userId})
          }
          `,
                    }),
               ).then(() => {
                    window.location.assign('/');
                    alert('User Deleted!');
               });
          }
     };

     render() {
          const formElementArray = [];

          for (let key in this.state.controls) {
               formElementArray.push({
                    id: key,
                    config: this.state.controls[key],
               });
          }

          let form = formElementArray.map(formElement => (
               <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={event =>
                         this.inputChangedHandler(event, formElement.id)
                    }
               />
          ));

          return (
               <div className={classes.EditUser}>
                    <form onSubmit={this.submitHandler}>
                         <h1>Edit User</h1>
                         {!this.props.loading ? (
                              <React.Fragment>
                                   {form}
                                   <Button btnType='Primary'>SUBMIT</Button>
                                   {this.props.isAdmin && (
                                        <Button
                                             btnType='Danger'
                                             clicked={this.deleteUserHandler}
                                        >
                                             DELETE USER
                                        </Button>
                                   )}
                              </React.Fragment>
                         ) : (
                              <Spinner />
                         )}
                    </form>
               </div>
          );
     }
}

const mapStateToProps = state => ({
     authUserId: state.auth.user.id,
});

export default connect(mapStateToProps)(EditUser);
