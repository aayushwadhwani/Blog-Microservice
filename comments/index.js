const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;

  let comments = [];

  if (postId in commentsByPostId) {
    comments = commentsByPostId[postId];
  }

  res.status(200).json(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;
  const { id: postId } = req.params;

  let comments = [];

  if (postId in commentsByPostId) {
    comments = commentsByPostId[postId];
  }

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[postId] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "commentCreate",
    data: {
      id: commentId,
      postId,
      content,
      status: "pending",
    },
  });

  res.status(201).json({
    status: "success",
    data: commentsByPostId[postId],
  });
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log(`Received a event: ${type}`);
  console.log(`Data: ${data}`);

  if (type == "commentModerate") {
    const { id, postId, content, status } = data;
    let comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment["id"] == id;
    });
    comment["status"] = status;

    await axios.post("http://localhost:4005/events", {
      type: "commentUpdate",
      data: {
        id,
        postId,
        content,
        status,
      },
    });
  }
  res.status(200).json({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Listening on port 4001.");
});