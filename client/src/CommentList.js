import React from "react";

const CommentList = (props) => {
  const { comments } = props;

  const renderedComment = comments.map((comment) => {
    let content;

    if (comment.status == "approved") {
      content = comment.content;
    }
    if (comment.status == "pending") {
      content = `This content is awaiting moderation: ${comment.content}`;
    }
    if (comment.status == "rejected") {
      content = `This content is rejected! ${comment.content}`;
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComment}</ul>;
};

export default CommentList;
