import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./Auth.module.css";
import * as actions from "../../store/actions";
import checkValidation from "../../utility/checkValidation";

import { Redirect } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinner/Spinner";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "E-mail"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "**********"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: checkValidation(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };

    let formIsValid = true;

    Object.keys(updatedControls).forEach(controlName => {
      formIsValid = updatedControls[controlName].valid && formIsValid;
    });

    this.setState({
      controls: updatedControls,
      formIsValid: formIsValid
    });
  };

  submitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value
    );
  };

  render() {
    const formElementArray = [];

    for (let key in this.state.controls) {
      formElementArray.push({
        id: key,
        config: this.state.controls[key]
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
        changed={event => this.inputChangedHandler(event, formElement.id)}
      />
    ));

    let redirect;

    if (this.props.redirect) {
      redirect = <Redirect to="/" />;
    }

    if (this.props)
      return (
        <div className={classes.Auth}>
          <form onSubmit={this.submitHandler}>
            <h1>Sign in</h1>
            {!this.props.loading ? (
              <>
                {form}
                {redirect}
              </>
            ) : (
              <Spinner />
            )}
            <Button disabled={!this.state.formIsValid} btnType="Primary">
              SUBMIT
            </Button>
          </form>
        </div>
      );
  }
}

const mapStateToProps = state => ({
  loading: state.auth.loading,
  redirect: state.auth.isLoggedIn
});

const mapDispatchToProps = dispatch => ({
  onAuth: (email, password) => dispatch(actions.auth(email, password))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
