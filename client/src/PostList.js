import axios from "axios";
import React, { useState, useEffect } from "react";

import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  const postList = async () => {
    const res = await axios.get("http://localhost:4002/posts");
    const json = res.data;
    console.log(json);
    setPosts(json);
  };

  useEffect(() => {
    postList();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-wrap flex-row justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
