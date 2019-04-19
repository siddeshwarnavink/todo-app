import React, { useEffect } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Spinner from "../UI/Spinner/Spinner";
import CommentMessage from "./CommentMessage/CommentMessage";
import PostComment from "./PostComment/PostComment";

export const Comments = props => {
  useEffect(() => {
    props.initComments("task", props.payload);
  }, []);

  return (
    <>
      {props.loading ? (
        <Spinner />
      ) : (
        <>
          <h1>Comments</h1>
          <PostComment type={props.type} payload={props.payload} />
          {props.comments &&
            props.comments.map((comment, index) => (
              <CommentMessage
                key={index}
                message={comment.message}
                isWriterIsReader={props.readerId === comment.creator.id}
                creator={comment.creator}
                created_at={comment.created_at}
              />
            ))}
        </>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  loading: state.comments.loading,
  comments: state.comments.comments,
  readerId: state.auth.user.id
});

const mapDispatchToProps = dispatch => ({
  initComments: (...args) => dispatch(actions.initComments(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
