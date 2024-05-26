const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// { "ajaj": { "postId": "ajaj", "title": "aaaa", comments: [{ "id": "aaa", "content": "sss" }] } }
const posts = {};

const handleEvent = (type, data) => {
  if (type == "postCreate") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type == "commentCreate") {
    const { id, content, postId, status } = data;
    console.log(data);
    console.log(JSON.stringify(posts));
    const post = posts[postId];
    const comments = post["comments"];
    comments.push({ id, content, status });
    posts[postId]["comments"] = comments;
  }

  if (type == "commentUpdate") {
    const { id, content, postId, status } = data;
    console.log(JSON.stringify(data));
    const postComments = posts[postId]["comments"];
    console.log(JSON.stringify(postComments));
    const comment = postComments.find((comment) => {
      return comment.id == id;
    });
    console.log("Aayaaa", comment);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.status(200).json({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");

  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log(`Processing event ${event.type}`);
    handleEvent(event.type, event.data);
  }
});
