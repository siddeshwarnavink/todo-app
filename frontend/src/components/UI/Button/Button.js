import React from "react";
import classes from "./Button.module.css";

const Button = props => (
  <button
    disabled={props.disabled}
    className={[classes.Button, classes[props.btnType]].join(" ")}
    onClick={props.clicked}
    type={props.type}
  >
    {" "}
    {props.children}
  </button>
);

export default Button;
