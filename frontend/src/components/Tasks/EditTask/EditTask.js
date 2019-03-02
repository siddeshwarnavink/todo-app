import React, { Component } from "react";

import * as actions from "../../../store/actions";
import { connect } from "react-redux";

import axios from "../../../axios";
import classes from "./EditTask.module.css";
import checkValidation from "../../../utility/checkValidation";

import Input from "../../UI/Input/Input";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";

class EditTask extends Component {
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
        value: this.props.taskData.title,
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
        value: this.props.taskData.description,
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
        value: this.props.taskMembers,
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
        value: this.props.taskData.starts_at,
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
        value: this.props.taskData.ends_at,
        valid: false,
        touched: false
      }
    }
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
              task(taskId: ${this.props.taskId}) {
                group {
                  members {
                    username
                    id
                  }
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
                  users: data.data.task.group.members
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

    this.setState({
      controls: updatedControls
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

    this.props.onEditTask(task, this.props.taskId, this.props.goFunc);
  };

  deleteTaskHandler = () => {
    const verify = window.confirm(
      "Are you sure that you want to delete this task?"
    );

    if (verify) {
      axios
        .post(
          `/?token=${localStorage.getItem("token")}`,
          JSON.stringify({
            query: `
              mutation {
                deleteTask(id: ${this.props.taskId})
              }
            `
          })
        )
        .then(() => {
          alert("Task Deleted!");
          window.location.assign("/");
        });
    }
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
          <h1>Edit task</h1>
          {!this.props.loading ? <>{form}</> : <Spinner />}
          <Button btnType="Primary">SUBMIT</Button>
          <Button
            btnType="Danger"
            clicked={this.deleteTaskHandler}
            type="button"
          >
            DELETE TASK
          </Button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onEditTask: (task, taskId, goFunc) =>
    dispatch(actions.editTask(task, taskId, goFunc))
});

export default connect(
  null,
  mapDispatchToProps
)(EditTask);
