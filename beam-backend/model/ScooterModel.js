var mongoose = require("mongoose");

var scooterSchema = mongoose.Schema({
  scooter_id: {
    type: Number,
    unique: true,
    required: true
  },
  address: { type: String },
  location: {
    type: {
      type: String,
      required: true,
      default: "Point",
    },
    coordinates: [Number],
  },
});

scooterSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Scooters", scooterSchema);
