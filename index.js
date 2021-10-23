const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./config.json");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
  res.render("index", {
    error: null,
    success: null,
  });
});

app.post("/", (req, res) => {
  let data = req.body;

  if (!data)
    return res.render("index", {
      error: "Name And Message Are Required",
      success: null,
    });

  if (data.message.length < 1)
    return res.render("index", {
      error: "Message Required",
      success: null,
    });

  if (data.name.length < 1)
    return res.render("index", {
      error: "Name Required",
      success: null,
    });

  if (data.message.length > 1000)
    return res.render("index", {
      error: "Message Too Long, It Should Not Exceed 1000 Words",
      success: null,
    });

  if (data.name.length > 30)
    return res.render("index", {
      error: "Name Too Long, It Should Not Exceed 50 Words",
      success: null,
    });

  axios
    .post(config.webhook, {
      embeds: [
        {
          color: 3108090,
          author: {
            name: data.name,
          },
          description: data.message,
        },
      ],
    })
    .then((response) => {
      if (response.data.err)
        return res.render("index", {
          error: "Discord Api Error",
          success: null,
        });

      return res.render("index", {
        error: null,
        success: "Successfully Sent Through Webhook",
      });
    });
});

app.listen(3000, () => {
  console.log("server started");
});
