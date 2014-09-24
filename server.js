//server.js

// Configure Pubnub:
var PUBNUB = require('pubnub');

// Load the server-pubnub.js file, it returns a function
// Immediately invoke this function, passing in the PUBNUB object
// Set the variable pubnub to the result of this function call
var panicPubnub = 
(require('./lib/server-pubnub.js'))(PUBNUB);
//var pubnub = panicPubnub.pubnub;

var panicQueue = 
(require('./lib/panic-queue.js'))(panicPubnub);

// Configure Express server:
var express = require('express');
var path = require('path');

var app = express();
// Configure jade templates and directory:
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

// Configure sessions:
app.use(express.cookieParser());
app.use(express.session({secret:'my super secret secretapapppxxllerjam,dfa654163210321'}));

// Parse form posts:
app.use(express.bodyParser());

// Host every static file in the static/ directory
app.use(express.static(path.join(__dirname, 'static')));

// Try and match requests to the routes defined in routes.js:
app.use(app.router);

// Log requests to console
app.use(express.logger('dev'));

// Set up routing
// The other file is out of scope. It returns a function, we call this function, passing dependencies
// The result of the function call is, all the routes are now bound to app
(require('./lib/routes.js'))(app, panicPubnub, panicQueue); 

// Wait to fire up the server until we have our Pubnub channels connected:
function waitTillPubNubOrTimeout(){
  var timedout = false;
  var panicOK = false;
  var backupOK = false;
  panicPubnub.events.on('connected', function(channel){
    if(channel === 'panic'){
      panicOK = true;
    } else if(channel === 'backup'){
      backupOK = true;
    }
    if(panicOK && backupOK){
      startServer();
    }
  })
  
  setTimeout(function(){
    if(!panicOK || !backupOK){
      throw('Waited 30 seconds with no pubnub connection')
    }
  }, 30*1000); // 30 seconds
}

function startServer(){
  require('http').createServer(app).listen(3000, function(err){
    console.log(err ? err : "Listening on 3000");
  })
}

waitTillPubNubOrTimeout();