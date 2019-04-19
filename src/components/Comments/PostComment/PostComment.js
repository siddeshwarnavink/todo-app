import React, { Component } from "react";

import Input from "../../UI/Input/Input";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import classes from "./PostComment.module.css";

export class PostComment extends Component {
  state = {
    comment: ""
  };

  postCommentHandler = e => {
    e.preventDefault();

    this.props.onPostComment(
      this.state.comment,
      this.props.type,
      this.props.payload
    );
  };

  render() {
    let isValidDescription = this.state.comment.split("").length > 3;

    return (
      <div>
        <form onSubmit={this.postCommentHandler}>
          <Input
            elementType="textarea"
            elementConfig={{}}
            changed={e => this.setState({ comment: e.target.value })}
          />

          <button
            type="submit"
            disabled={!isValidDescription || this.props.loading}
            className={classes.PostButton}
          >
            Post a comment
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.comments.loading
});

const mapDispatchToProps = dispatch => ({
  onPostComment: (...args) => dispatch(actions.postComment(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostComment);
