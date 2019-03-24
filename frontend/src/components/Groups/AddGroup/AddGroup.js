import React, { useState } from "react";
import { connect } from "react-redux";

import * as actions from "../../../store/actions";
import checkValidation from "../../../utility/checkValidation";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const AddGroup = props => {
  const [formData, setFormData] = useState({
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
        users: props.members,
        label: "Members"
      },
      value: "",
      valid: false,
      touched: false
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
      props.onCreateGroup(
        formData.title.value,
        formData.description.value,
        formData.members.value,
        () => {
          props.loadGroups();
          props.modalClose();
        }
      );
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
        <h1>Add Group</h1>
        {!props.groupLoading && (
          <>
            {form}
            <Button disabled={!formIsValid} btnType="Primary">
              SUBMIT
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  groupLoading: state.groups.loading
});

const mapDispatchToProps = dispatch => ({
  onCreateGroup: (...args) => dispatch(actions.addGroup(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGroup);
