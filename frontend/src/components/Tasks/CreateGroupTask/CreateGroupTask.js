import React, { Component } from "react";

import * as actions from "../../../store/actions";
import { connect } from "react-redux";

import axios from "../../../axios";
import classes from "./CreateGroupTask.module.css";
import checkValidation from "../../../utility/checkValidation";

import Input from "../../UI/Input/Input";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";

class CreateGroupTask extends Component {
  _isMounted = false;

  state = {
    controls: {
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          label: "Title",
          placeholder: "e.g: Dev Group"
        },
        value: "",
        validation: {
          required: true,
          minLength: 2,
          maxLength: 45
        },
        valid: false,
        touched: false
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          label: "Description",
          placeholder: "eg. This group is only for developers"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 1073741824
        },
        valid: false,
        touched: false
      },
      members: {
        elementType: "selectUser",
        elementConfig: {
          loading: false,
          users: [],
          label: "Members"
        },
        value: [],
        valid: false,
        touched: false
      },
      startsAt: {
        elementType: "dateTime",
        elementConfig: {
          label: "Starts at"
        },
        validation: {
          required: true
        },
        value: "",
        valid: false,
        touched: false
      },
      endsAt: {
        elementType: "dateTime",
        elementConfig: {
          label: "Ends at"
        },
        validation: {
          required: true
        },
        value: "",
        valid: false,
        touched: false
      }
    },
    formIsValid: false
  };

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.setState(prvState => ({
        controls: {
          ...prvState.controls,
          members: {
            ...prvState.controls.members,
            elementConfig: {
              ...prvState.controls.members.elementConfig,
              loading: true
            }
          }
        }
      }));
    }

    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
      {
        group(id: ${this.props.groupId}) {
          members {
            id
            username
          }
        }
      }
      `
        })
      )
      .then(({ data }) => {
        if (this._isMounted) {
          this.setState(prvState => ({
            controls: {
              ...prvState.controls,
              members: {
                ...prvState.controls.members,
                elementConfig: {
                  ...prvState.controls.members.elementConfig,
                  loading: false,
                  users: data.data.group.members
                }
              }
            }
          }));
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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

    const task = {
      title: this.state.controls.title.value,
      description: this.state.controls.description.value,
      members: this.state.controls.members.value,
      starts_at: this.state.controls.startsAt.value,
      ends_at: this.state.controls.endsAt.value,
      groupId: this.props.groupId
    };

    this.props.onCreateTask(task, this.props.goFunc);
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

    return (
      <div>
        <form onSubmit={this.submitHandler} className={classes.Form}>
          <h1>Create task</h1>
          {!this.props.loading ? <>{form}</> : <Spinner />}
          <Button disabled={!this.state.formIsValid} btnType="Primary">
            SUBMIT
          </Button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onCreateTask: (task, goFunc) => dispatch(actions.createTask(task, goFunc))
});

export default connect(
  null,
  mapDispatchToProps
)(CreateGroupTask);
