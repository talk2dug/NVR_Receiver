const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let videoFiles = new Schema(
  {
    "file":{
        type: String
      },
    "type":{
        type: String
      },
    "officer":{
        type: Number
      },
    "date":{
        type: String
      },
    "action":{
        type: String
      },
    "channel":{
        type: Number
      },
    "lon":{
        type: Number
      },
    "lat":{
        type: Number
      },
    "speed":{
        type: String
      },
    "heading": {
      type: Number
    },
    "time": {
      type: Date
    },
    
},
  { collection: "VideoFiles" }
);
module.exports = mongoose.model("videofiles", videoFiles);