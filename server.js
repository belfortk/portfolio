const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var profile = require("./profile");
const axios = require("axios");
const mcAPIKey = "apikey 47bd649739bce024b77057381a86af8f-us17";

const app = express();
// ...
// then define the route that will use your custom router
app.use(express.static("public"));
app.use("/profile", profile);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Here we're setting the views directory to be ./views
// thereby letting the app know where to find the template files
app.set("views", "./views");

// Here we're setting the default engine to be ejs
// note we dont need to require it, express will do that for us
app.set("view engine", "ejs");

// Now instead of using res.send we can use
// res.render to send the output of the template by filename

app.get("/", (req, res) => {
  const data = {
    person: {
      firstName: "Kyle",
      lastName: "Belfort"
    }
  };
  res.render("index", data);
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  var errorMess = null;
  const mailchimpListURL = "https://us17.api.mailchimp.com/3.0/lists/b46315d170/members/";
  const options = { headers: { Authorization: mcAPIKey } };
  var mcPOSTObject = {
    email_address: req.body.email,
    status: "subscribed",
    merge_fields: {
      FNAME: req.body.firstName,
      LNAME: req.body.lastName
    }
  };

  axios
    .post(mailchimpListURL, mcPOSTObject, options)
    .then(function(response) {
      req.body.message;
      return axios.post(mailchimpListURL + response.data.id + "/notes", { note: req.body.message }, options);
    })
    .catch(function(error) {
      console.log(error);
    });

  res.send("ok");
});

app.listen(8080, () => {
  console.log("listening at http://localhost:8080");
});
