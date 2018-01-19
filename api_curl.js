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
 // * to be added : try / catch if child_process fails
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
// Return list of response time past and present by application for a given controller
// * Create array of applications with past and present avg resp. time.
//
//

app.get('/api/applications/metrics', function (req, res, next){
  console.log('Spawning curl');
});

//
// Where everything starts
// * configure port according to company policies 
//

 app.listen(3000);
 console.log("magic happen on port 3000");


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
