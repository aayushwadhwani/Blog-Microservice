const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type == "commentCreate") {
    const content = data["content"];

    const status = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "commentModerate",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content,
      },
    });
  }

  res.status(200).json({ status: "success" });
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
