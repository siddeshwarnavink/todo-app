import React from "react";
import classes from "./Input.module.css";

import moment from "moment";

import Checkbox from "../Checkbox/Checkbox";
import SelectUser from "./SelectUser/SelectUser";
import DateTime from "react-datetime";

const Input = props => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join("  ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join("  ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={inputClasses.join("  ")}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;

    case "selectUser":
      inputElement = (
        <SelectUser
          {...props.elementConfig}
          value={props.value}
          changed={props.changed}
        />
      );
      break;

    case "dateTime":
      inputElement = (
        <>
          <DateTime
            inputProps={{
              ...props.elementConfig,
              className: inputClasses.join("  "),
              onKeyDown: e => e.preventDefault()
            }}
            value={props.value}
            onChange={e => {
              props.changed({
                target: {
                  value: moment(e).format("YYYY-MM-DD HH:mm:ss")
                }
              });
            }}
          />
        </>
      );
      break;

    case "checkbox":
      inputElement = (
        <Checkbox
          checked={props.value}
          {...props.elementConfig}
          onChange={e => {
            props.changed({
              target: {
                value: e.target.checked
              }
            });
          }}
        />
      );
      break;

    default:
      inputElement = (
        <input
          className={inputClasses.join("  ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.elementConfig.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
