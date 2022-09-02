const express = require("express");
const https = require("https");
const path = require("path");
const app = express();
require("dotenv").config();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.set('views', './views');
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/signup.html"))
})

app.post("/weather", (req, res) => {
    const lat = req.body.lat
    const lon = req.body.lon
    const apiKey = process.env.WEATHER_API_KEY
    const units = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=" + units;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            const weatherDetails = {
                imageURL: imageURL,
                temp: weatherData.main.temp,
                describe: weatherData.weather[0].description,
                humidity: weatherData.main.humidity,
                wind: weatherData.wind,
                country: weatherData.sys.country,
                state: weatherData.name,
            }
            res.render('weather',weatherDetails)
        })
    })
})

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})  