import React, { useState } from "react";

import checkValidation from "../../../utility/checkValidation";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import axios from "../../../axios";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";

const EditGroup = props => {
  const [formData, setFormData] = useState({
    title: {
      elementType: "input",
      elementConfig: {
        label: "Title",
        type: "text",
        placeholder: "e.g: Dr.RoX"
      },
      value: props.groupData.title,
      validation: {
        required: true
      },
      valid: true,
      touched: false
    },

    description: {
      elementType: "textarea",
      elementConfig: {
        label: "Description",
        placeholder: "eg. This group is only for developers"
      },
      value: props.groupData.description,
      validation: {
        required: true,
        minLength: 6,
        maxLength: 1073741824
      },
      valid: true,
      touched: false
    },
    members: {
      elementType: "selectUser",
      elementConfig: {
        loading: false,
        users: props.groupData.allUsers,
        label: "Members"
      },
      value: props.groupData.members,
      valid: true,
      touched: false
    }
  });
  const [formIsValid, setFormIsValid] = useState(true);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...formData,
      [controlName]: {
        ...formData[controlName],
        value: event.target.value,
        valid: checkValidation(
          event.target.value,
          formData[controlName].validation
        ),
        touched: true
      }
    };

    let updatedFormIsValid = true;

    Object.keys(updatedControls).forEach(controlName => {
      updatedFormIsValid =
        updatedControls[controlName].valid && updatedFormIsValid;
    });

    setFormData(updatedControls);
    setFormIsValid(updatedFormIsValid);
  };

  const submitHandler = event => {
    event.preventDefault();
    if (formIsValid) {
      axios
        .post(
          `/?token=${localStorage.getItem("token")}`,
          JSON.stringify({
            query: `
            mutation {
              editGroup(id: ${props.groupId}, title: "${
              formData.title.value
            }", description: "${formData.description.value}"
            members: "[${formData.members.value}]")
            }
        `
          })
        )
        .then(() => {
          props.initPage();
          props.notify("Group Updated Successfully");
        });
    }
  };

  const deleteGroup = () => {
    const verify = window.confirm(
      "Are you sure that you want to delete this group?"
    );

    if (verify) {
      axios
        .post(
          `/?token=${localStorage.getItem("token")}`,
          JSON.stringify({
            query: `
              mutation {
                deleteGroup(id: ${props.groupId})
              }
            `
          })
        )
        .then(() => {
          alert("Group Deleted!");
          window.location.assign("/");
        });
    }
  };

  const formElementArray = [];

  for (let key in formData) {
    formElementArray.push({
      id: key,
      config: formData[key]
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
      changed={event => inputChangedHandler(event, formElement.id)}
    />
  ));

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h1>Edit Group</h1>
        {form}
        <Button disabled={!formIsValid} btnType="Primary">
          SUBMIT
        </Button>

        <Button type="button" btnType="Danger" clicked={deleteGroup}>
          DELETE GROUP
        </Button>
      </form>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  notify: message => dispatch(actions.notify({ message }))
});

export default connect(
  null,
  mapDispatchToProps
)(EditGroup);
