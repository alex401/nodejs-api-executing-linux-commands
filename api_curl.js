var express   =    require("express");
var mysql     =    require('mysql');
var bodyParser = require('body-parser');
var app       =    express();
const child_process = require('child_process');
const userconnect = "alex@customer1:password01"

 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false }));

 // parse application/json
 app.use(bodyParser.json());

 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });

/* Are we going to create a DB ? keeping it just in case
 */

  var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'root',
   database : 'dbname'
 });

  //  connection.connect();

 app.get("/",function(req,res){
  console.log("someone connected");
 });

 //
 // Return list of applications for a given controller
 //
 //

app.get('/api/applications', function (req, res, next){
  console.log('Spawning curl');
  var result ='';
  var curlProc = child_process.exec('/usr/bin/curl --user '+ userconnect +' "http://pwc.loc:8090/controller/rest/applications?output=json"');
  curlProc.stdout.on('data', function(data) {
    result += data;
});
  curlProc.on('exit', () => {
          result= JSON.parse(result);
          console.log('process exit');
          console.log(result.length);
          res.send(result);
          //res.send();
      });
});

//
// Return list of response time past and presnet by application for a given controller
//
//

app.get('/api/applications/metrics', function (req, res, next){
  console.log('Spawning curl');
  var result =[];
  //username and password should be 111 parameters
  var curlProc = child_process.exec('/usr/bin/curl --user '+ userconnect +' "http://pwc.loc:8090/controller/rest/applications/?output=json"');
  curlProc.stdout.on('data', function(data) {

    result += data;
  });
  curlProc.on('exit', () => {
    result= JSON.parse(result);
          console.log('process exit');
        //  console.log(result);
        //  res.send(result);
        console.log(result.length)

        // TO IMPLEMENT
        //for each application, get latest metrics and past metrics
        for (i = 0; i < result.length; ++i) {
          temp = result[i];
          var curlProc2 = child_process.exec('/usr/bin/curl --user '+ userconnect +' "http://pwc.loc:8090/controller/rest/applications/'+temp.id+'?output=json"');
        //  console.log(i + "huhu")
          curlProc2.stdout.on('data', function(data) {

            temp += data;
            console.log(data)
          });
        //  console.log(temp)
        }
      });
});

 app.listen(3000);
 console.log("magic happen on port 3000");



/// ****************************
/// UTILS
/// ****************************
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


//-------------------------------------------

// Constructor
function Applications(id, name, comment, pastaverage, currentaverage) {
  // always initialize all instance properties
  this.id = id;
  this.name = name;
  this.comment = comment;
  this.pastaverage = pastaverage;
  this.currentaverage = currentaverage;

}
// class methods
Applications.prototype.foobar = function() {

};

// export the class
module.exports = Applications;
