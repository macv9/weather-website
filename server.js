require("dotenv").config();

const express = require("express");
const https = require("https");
const app = express();
const port = process.env.port || 3000;
const key = process.env.KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("homepage");
});

app.post("/", function (req, res) {
  const city = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  https.get(url, function (response) {
    if (response.statusCode != 200) {
      res.render("error", {
        errorCode: response.statusCode,
        errorMsg: response.statusMessage,
      });
    } else {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        res.render("weather", {
          city: city,
          country: weatherData.sys.country,
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          pressure: weatherData.main.pressure,
          image: weatherData.weather[0].icon,
        });
      });
    }
  });
});

app.listen(port, function () {
  console.log("Server is Started");
});
