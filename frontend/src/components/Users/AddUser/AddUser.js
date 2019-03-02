import React, { useState } from "react";

import checkValidation from "../../../utility/checkValidation";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import axios from "../../../axios";

const AddUser = props => {
  const [formData, setFormData] = useState({
    username: {
      elementType: "input",
      elementConfig: {
        label: "Username",
        type: "text",
        placeholder: "e.g: Dr.RoX"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },

    email: {
      elementType: "email",
      elementConfig: {
        label: "Email",
        type: "text",
        placeholder: "e.g: admin@siddeshrocks.in"
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
      elementType: "password",
      elementConfig: {
        label: "Password",
        type: "text",
        placeholder: "e.g: letmein123"
      },
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },

    isAdmin: {
      elementType: "checkbox",
      elementConfig: {
        label: "Is Admin"
      },
      value: false,
      valid: true,
      touched: true
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

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
          addUser(username: "${formData.username.value}", email: "${
              formData.email.value
            }", isAdmin: ${formData.isAdmin.value}, password: "${
              formData.password.value
            }")
        }
        `
          })
        )
        .then(() => {
          props.loadMembers();
          props.modalClose();
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
        <h1>Add User</h1>
        {form}
        <Button disabled={!formIsValid} btnType="Primary">
          SUBMIT
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
