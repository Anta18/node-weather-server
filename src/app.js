const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address Not Provided!",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error)
        return res.send({
          error,
        });
      else {
        forecast(
          latitude,
          longitude,
          (
            error,
            { temperature, feelslike, precipitation, description } = {}
          ) => {
            if (error)
              return res.send({
                error,
              });
            else {
              return res.send({
                location,
                temperature,
                feelslike,
                precipitation,
                description,
              });
            }
          }
        );
      }
    }
  );
});
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "EndPoint: /weather,Required query:address",
    title: "Help",
    name: "Antariksh",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Antariksh",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Antariksh",
    errorMessage: "Page not found.Coming Soon",
  });
});

app.listen(3000, () => {
  console.log("server is up on port 3000");
});
