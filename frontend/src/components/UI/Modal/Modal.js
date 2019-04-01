import React, { Component } from "react";
import Backdrop from "../Backdrop/Backdrop";
import { isBrowser } from "react-device-detect";
import Button from '../Button/Button'

import classes from "./Modal.module.css";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0",
            height: isBrowser && `${this.props.size * 10}%`,
            overflowY: this.props.scroll ? "scroll" : "hidden"
          }}
        >
          <span style={{ float: 'right' }}>
          <Button btnType="Secondary" clicked={this.props.modalClosed}>Close</Button>
          </span>
          {this.props.children}
        </div>
      </>
    );
  }
}

export default Modal;
