const express = require("express");
const podyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(podyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/posts", async (req, res) => {
  // creates random ID
  const id = randomBytes(4).toString("hex");

  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "postCreate",
    data: posts[id],
  });

  res.status(201).json({
    status: 201,
    data: posts[id],
  });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  console.log(`Received a event: ${type}`);
  console.log(`Data: ${data}`);

  res.status(200).json({ status: "OK" });
});

app.listen(4000, () => {
  console.log("Listening on port 4000.");
});
