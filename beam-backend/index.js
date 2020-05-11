const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var ScooterModal = require("./model/ScooterModel");

const app = express();
const port = process.env.PORT || "8000";

app.use(bodyParser.json());

mongoose.connect(
  "YOUR_MONGO_DB_SERVER_URL",
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log("error connecting to db");
    else console.log("Connected");
  }
);
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("BEAM Task");
});

app.post("/update_scooters", (req, res) => {
  const data = req.body.data;
  ScooterModal.insertMany(data, (err, scooters) => {
    res.status(200).json(scooters);
  });
});

app.post("/get_nearby_scooters", (req, res) => {
  const coordinates = req.body.coordinates;
  const numberOfScooters = req.body.numberOfScooters;
  const maxDistance = req.body.maxDistance;
  ScooterModal.find(
    {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: maxDistance,
        },
      },
    },
    (err, scooters) => {
      res.status(200).json({
        scooters: scooters ? [...scooters] : null
      });
    }
  ).limit(numberOfScooters);
});

app.listen(port, () => {
  console.log(`Listening to requests on ${port}`);
});
