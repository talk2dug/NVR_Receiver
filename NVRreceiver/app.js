var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const gpsLOGS = require("./schemas/models");
const videoFiles = require("./schemas/videoFiles");
const officerLogs = require("./schemas/officerInfo");
var app = express();
var ncp = require('ncp').ncp;
var moment = require('moment')
const fs = require('fs')

var exec = require('child_process').exec;

const mongoose = require("mongoose");
var ffmpeg = require('fluent-ffmpeg');
  var uri = "mongodb://localhost:27017/SPD_NVR";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
var d = require('diskinfo');
const { isRegExp } = require('util');

function getDrives() {
    d.getDrives(function(err, aDrives) {
        for (var i = 0; i < aDrives.length; i++) {
            if (aDrives[i].mounted === "/mnt/drive") {
                //driveMounted = 1;
                //console.log(aDrives[i])
            } else {
                //driveMounted = 0;}
            }
        }
    });

}

var copying = 0



function copyFiles(file, fileType, fileName){
  console.log(file)
  copying = 1
  var date = moment().format('MMddyyyy')
  //ncp.limit = 16;

var toLocation  = '/home/jack/nvr_Data/'+ date  + "/" +  fileType +"/" + fileName
var fromLocatiopn = file.toString()
console.log("HERE");
console.log(fromLocatiopn)
console.log(toLocation)
  ncp(fromLocatiopn,toLocation , function(err) {
    
      if (err) {
          return console.error(err);
      }
      console.log('done!');
      copying = 0
  });




}
var t = 0
setInterval(() => {
 t = t + 1
  if(copying===1){
    
    console.log("coppying" + t)


  }
  
}, 1000);



function mountDrive() {
    exec('/sbin/fdisk -l', function(error, stdout, stderr) {
        if (error) {
            console.log(error)
        }
        // Clock should be set now, exit;
        var string = stdout.toString()
        var splitString = string.replace(/\t/, " ").split("\n")
        for (i = 0; i < splitString.length; i++) {
            var stringWHATEVER = splitString[i].replace(/\s/g, ":")
            stringWHATEVER = stringWHATEVER.split(":")
            //console.log(stringWHATEVER)
            if (stringWHATEVER[12] === '1.8T') {
                exec('mount ' + stringWHATEVER[0] + ' /mnt/drive', function(error2, stdout2, stderr2) {
                    if (error2) {
                        console.log(error2)
                        //copyFiles()
                    }
                    if (!error2) {
                        console.log("Mounted")
                        exec('ls -l /mnt/drive', function(error2, stdout2, stderr2) {
                            if (error2) {
                                console.log(error2)
                            }
                            if (!error2) {
                                console.log(stdout2)
                            }
                        })
                        //copyFiles()
                    }
                    //console.log(stdout2)
                    //console.log(stderr2)
                    
                    readofficerDataFile()
                    //getGPSFiles()
                    //getVideoBackUpFiles()
                    //getVideoLiveFiles()
                })
            }
            //driveMounted ===1;
            //process.exit();
        }
    });
}
function readofficerDataFile(){
 
    fs.readFile('/mnt/drive/data/officerStatusData.txt', 'utf8', (err, data) => {
        if (err) {
            //console.log("eeeeerrrror")
            console.log(err)
            return
        }
        var cleanedData = data.split("\n")
        for(var i = 0; i<cleanedData.length;i++){
        var splitCleanedData = cleanedData[i].split(",")
        for(var k = 0; k<splitCleanedData.length;k++){
            console.log(splitCleanedData[k])
            
            
try {
    



            var cleaningGPSPacket = splitCleanedData[5].split("{")
            var lat = cleaningGPSPacket[1].split(":")
           
            var badgeNumber = splitCleanedData[0].split(":")
            var shiftStatus = splitCleanedData[1].split(":")
            var date= splitCleanedData[2].split(":")
            var action = splitCleanedData[3].split(":")
            
            var lon = splitCleanedData[5].split(":")
            lon = lon[1].split(" ")
            var heading = splitCleanedData[6].split(":")

//console.log(action)
          
            console.log(badgeNumber[1])
            console.log(shiftStatus[1])
            console.log(date[1])
            console.log(action[1])
            console.log(lon[1])
            console.log(lat[1])
            console.log(heading[1])
            
        } catch (error) {
    console.log(error)
        }
        }
        
    
   

    }


})
}
/*

 for (i = 0; i < splitCleanedData.length; i++) {
        console.log(splitCleanedData[i])
        try {
            
      


        var officerLogsData = new officerLogs({
        'badgeNumber':cleanedData[i].badgeNumber,
        'loggedOn': cleanedData[i].loggedOn,
        'shiftStatus': cleanedData[i].shiftStatus,
        'date': cleanedData[i].date,
        'action': cleanedData[i].action,
        
        'gps': {
        'lat': cleanedData[i].gpsPacket.lat,
        'heading': cleanedData[i].gpsPacket.heading,
        'satsActive': cleanedData[i].gpsPacket.satsActive,
        'alt': cleanedData[i].gpsPacket.alt,
        'time': cleanedData[i].gpsPacket.time,
        'quality': cleanedData[i].gpsPacket.quality,
        'speed': cleanedData[i].gpsPacket.speed
            }
            })
            officerLogsData.save(function(err, result) {
            
                if (err) {
                  //res.send(err);
                  console.log("ERRRRROR")
                  console.log(err)
                } else {
                  //res.send(result);
                  console.log("result")
                  console.log(result)
                }
              });
            } catch (error) {
            console.log(error)
            }
        }
*/
function readGPSFile(file){
    console.log("file")
  var objects = []

var filelocation = '/mnt/drive/data/' + file


  fs.readFile(filelocation, 'utf8', (err, data) => {
    if (err) {
        console.log("eeeeerrrror")
        console.log(err)
        return
    }
    var cleanedData = data.split("\n")
        //console.log(data)

    for (i = 0; i < cleanedData.length; i++) {
       
       try {
        var gpsData2 = JSON.parse(cleanedData[i])
    } catch (error) {
        console.log("errrooooooor")
        console.log(err)
    }
        //var date = moment(objects[i].time).format("MM-DD-yyyy HH:mm:ss")
     
        var gpsfileData = new gpsLOGS({
            "lon": gpsData2.lon,
            "lat": gpsData2.lat,
            "heading": gpsData2.heading,
            "satsActive": gpsData2.satsActive,
            "alt": gpsData2.alt,
            "time": gpsData2.time,
            "quality": gpsData2.quality,
            "speed": gpsData2.speed,
       
           
        })
        gpsfileData.save(function(err, result) {
            
               if (err) {
                 //res.send(err);
                 console.log("ERRRRROR")
                 console.log(err)
               } else {
                 //res.send(result);
                 console.log("result")
                 console.log(result)
               }
             });

           
       
           
       
    }


    
 
})


}

function getVideoBackUpFiles(){

  fs.readFile('/mnt/drive/data/videoBackUp.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    //console.log(data)
    //var obj = JSON.parse(data);
    var splitdata = data.split("\n")
    for(var i=0; i<splitdata.length; i++){
      //console.log(splitdata[i].length)
      
      //console.log(splitdata[i])
      
        try {
          
          var theobj = JSON.parse(splitdata[i]);
          //console.log("The obj");
          var locationString = theobj.location.toString()
          var fileName = theobj.location.split("/")
          //console.log(fileName[4])
          copyFiles(locationString, 'backup', fileName[4])
          var VideoFiledata = {
            'file': fileName[4],
            "type": 'backup',
            "officer":theobj.officer,
            "date":theobj.date,
            "action":theobj.action,
            "channel":theobj.channel,
            "lon":theobj.gpsData.lon,
            "lat":theobj.gpsData.lat,
            "speed":theobj.gpsData.speed,
            "heading": theobj.gpsData.heading,
            "time": theobj.gpsData.time
        };
     var videoFile = new videoFiles(VideoFiledata)
     videoFile.save(function(err, result) {
            if (err) {
              //res.send(err);
              console.log(err)
            } else {
              //res.send(result);
              console.log(result)
            }
          });
  } catch (error) {
          console.log(error)
  } 
  }
})


}

function getVideoLiveFiles(){

    fs.readFile('/mnt/drive/data/videoFiles.txt', 'utf8', (err, data) => {
      if (err) {
          console.error(err)
          return
      }
      //console.log(data)
      //var obj = JSON.parse(data);
      var splitdata = data.split("\n")
      for(var i=0; i<splitdata.length; i++){
        //console.log(splitdata[i].length)
        
        //console.log(splitdata[i])
        
          try {
            
            var theobj = JSON.parse(splitdata[i]);
            //console.log("The obj");
            var locationString = theobj.location.toString()
            var fileName = theobj.location.split("/")
            //console.log(fileName[4])
            copyFiles(locationString, 'live', fileName[4])
            

                            var VideoFiledata = {
                                'file': fileName[4],
                                "type": 'live',
                                "officer":theobj.officer,
                                "date":theobj.date,
                                "action":theobj.action,
                                "channel":theobj.channel,
                                "lon":theobj.gpsData.lon,
                                "lat":theobj.gpsData.lat,
                                "speed":theobj.gpsData.speed,
                                "heading": theobj.gpsData.heading,
                                "time": theobj.gpsData.time
                            };
                         var videoFile = new videoFiles(VideoFiledata)
                         videoFile.save(function(err, result) {
                                if (err) {
                                  //res.send(err);
                                  console.log(err)
                                } else {
                                  //res.send(result);
                                  console.log(result)
                                }
                              });
                                    
                            

      
    } catch (error) {
            console.log(error)
    } 
    }
  })
  
  
  }

function getGPSFiles(){
exec('ls -l /mnt/drive', function(error2, stdout2, stderr2) {
    if (error2) {
        console.log(error2)
    }
    if (!error2) {
        var newStringArray = stdout2.split("\n")
        var splitString = newStringArray[2].split(" ")
        //console.log(splitString[9])
        exec('ls -l /mnt/drive/' + splitString[10], function(error2, stdout2, stderr2) {
            if (error2) {
                console.log(error2)
            }
            if (!error2) {
                var newStringArray = stdout2.split("\n")
                for(var i = 0; i< newStringArray.length; i++){
                    var splitString = newStringArray[i].split(" ")
                    //console.log(splitString[9])
                    
try {
    var fileName = splitString[9]
                    
                    //console.log(fileName)
                    try {
                        var newString = fileName.split("-")
                    if(newString[0]==="GPS"){
                        console.log("FOUND GPS");
                        readGPSFile(fileName)

                    }
                    } catch (error) {
                        //console.log(error)
                    }


                    
                   
} catch (error) {
    console.log(error)
}


                    

                }
                
             
            }
        })
    }
})
}


function readFileMetaData(){
exec('ls -l /mnt/drive', function(error2, stdout2, stderr2) {
    if (error2) {
        console.log(error2)
    }
    if (!error2) {
        var newStringArray = stdout2.split("\n")
        var stringObject = newStringArray[8].split(" ")

        var videoName = ""
        videoName = stringObject[9]
        var fileLocation = '/mnt/drive/' + videoName
        //console.log(fileLocation)
        ffmpeg.ffprobe(fileLocation, function(err, metadata) {
            //console.log(metadata.format.tags.comment);
            if (err) {
                console.log(err)
            }
        });
    }
})
}
function connectMongo() {
  mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
  });
  const connection = mongoose.connection;
  connection.once("open", function() {
      console.log("MongoDB database connection established successfully");
      mountDrive()
  });
}
connectMongo()


module.exports = app;