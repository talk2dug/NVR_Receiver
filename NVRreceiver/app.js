var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
function getDrives(){
d.getDrives(function(err, aDrives) {
        
    for (var i = 0; i < aDrives.length; i++) {
      
        if(aDrives[i].mounted==="/media/drive"){
            driveMounted = 1;
            console.log(aDrives[i])
      }
      else{
          driveMounted = 0;}

      }
    
});
}
var exec = require('child_process').exec;
function mountDrive(){
                    exec('/sbin/fdisk -l', function(error, stdout, stderr) {
                      if (error){
                        console.log(error)
                    }
                      // Clock should be set now, exit
                      //console.log(stdout);
                      var string = stdout.toString()
                      var splitString = string.replace(/\t/," ").split("\n")
                      
                      

                      for(i=0;i<splitString.length;i++){
                        //console.log(i)
                        //console.log("___")
                        
                       

                        
                      var stringWHATEVER = splitString[i].replace(/\s/g,":")
                      stringWHATEVER = stringWHATEVER.split(":")
                      //console.log(stringWHATEVER)
                        if(stringWHATEVER[12] === '1.8T'){
               
                            exec('mount ' + stringWHATEVER[0] +' /media/drive' , function(error2, stdout2, stderr2) {
                              if (error2){
                                console.log(error2)
                              }
                              if (!error2){
                                console.log("Mounted")
                                exec('ls -l /media/drive' , function(error2, stdout2, stderr2) {
                                  if (error2){
                                    console.log(error2)
                                  }
                                  if (!error2){
                                    console.log(stdout2)
                                    

                                    var ncp = require('ncp').ncp;

                                    ncp.limit = 16;

                                      ncp('/media/drive', '/home/jack/nvr_Data/', function(err) {
                                      if (err) {
                                              return console.error(err);
                                      }
                                          console.log('done!');
                                        });











                                  }
                               
                                })
                              
                              }
                            console.log(stdout2)
                            console.log(stderr2)
                       
                           

                            })
                          }     
                      driveMounted ===1;
                      //process.exit();
                        }
                    });
                  }

                  const fs = require('fs')
var objects = []
                  fs.readFile('/media/drive/data/gps.txt', 'utf8' , (err, data) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                    var cleanedData = data.split("\n")
                    for(i=0;i<cleanedData.length;i++){
                      while(cleanedData[i].charAt(0) === '0') {
                        cleanedData[i] = cleanedData[i].substr(1);
                      }
                      try {
                        
                      
                      var gpsData = JSON.parse(cleanedData[i])
                      objects.push(gpsData)
                      //console.log(objects[1].lon)
                    } catch (error) {
                        console.log(err)
                    }
                    }
                    for(i=0;i<objects.length;i++){
                      //console.log(objects[i].time)
                      var date = moment(objects[i].time).format("MM-DD-yyyy HH:mm:ss")
                      //console.log(date)


                    }
                    //console.log(objects[1].lon)
                  })    
                  var ffmpeg = require('fluent-ffmpeg');

ffmpeg.ffprobe('/media/drive/live/01cea154-acc6-4062-adf6-05f8f8129e49.mp4',function(err, metadata) {
  console.log(metadata.streams[0].tags);
});       
module.exports = app;
