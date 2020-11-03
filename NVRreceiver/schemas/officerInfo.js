const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let officerLogs = new Schema(
  {
    "badgeNumber":{
        type: Number
      },
      'loggedOn':{
        type: Number
      },
      'shiftStatus': {
        type: String
      },
      'date': {
        type: String
      },
      'action': {
        type: String
      },
    'gps':{
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
            type: Number
          }

    }
},
  { collection: "officerLogs" }
);
module.exports = mongoose.model("officerLogs", officerLogs);

