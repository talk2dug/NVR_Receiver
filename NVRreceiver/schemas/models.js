const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let gpsLogs = new Schema(
  {
    "lon":{
        type: Number
      },
    "lat":{
        type: Number
      },
    "heading":{
        type: String
      },
    "satsActive":{
        type: Number
      },
    "alt":{
        type: Number
      },
    "time":{
        type: String
      },
    "quality":{
        type: String
      },
    "speed":{
        type: String
      },
    "name": {
      type: String
    },
    "age": {
      type: Number
    },
    "location": {
      type: String
    }
},
  { collection: "GPSLOGS" }
);
module.exports = mongoose.model("gpslogs", gpsLogs);