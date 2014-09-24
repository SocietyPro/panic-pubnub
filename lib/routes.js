module.exports = function(app, panicPubnub, panicQueue){
  var pubnub = panicPubnub.pubnub;

  // Catchall route. We will invoke next() to pass the request to a downstream route without sending a response.
  app.all('*', function(req, res, next){
    //console.log('Headers for', req.path, '\n', JSON.stringify(req.headers, null, 2));
    var isTrusted = 
      req.headers.eve_trusted === 'Yes' 
        ? true : false;

    // Set up session variables
    req.session.isTrusted = isTrusted;

    // We have singleton arrays available in panicQueue with ALL messages, and convenience filter functions
    // We will use this to choose what messages should be displayed to the user
    // panicLog: An array of message objects, to be rendered on the standby and panic pages
    // lastSynced: A Number, valueOf() the last known time when panicLog was synced from the panicQueue

    // Initialize panic log to [] if it's undefined:
    req.session.panicLog = req.session.panicLog || [];

    /*Debug: Load all panics every time
    req.session.panicLog = panicQueue.all;
    var newPanics = panicQueue.recent.panics(0);
    console.log(newPanics);
    */

    // Initialize lastSynced to now if it's undefined
    // This will not catch up on any old messages. 
    // It will begin the panicLog history from this point in time.
    req.session.lastSynced = req.session.lastSynced || new Date().valueOf();
    // req.session.lastSynced = req.session.lastSynced || 0; // if you want to start at the beginning of panic history

    // Sync any recent panics into panicLog (i.e., since the last request from this session)
    var newPanics = panicQueue.recent.panics(req.session.lastSynced);
    console.log('New Panics');
    console.log(newPanics);
    req.session.panicLog = 
    req.session.panicLog.concat(newPanics);

    // Keep track of this timestamp now that panicLog is up to date:
    req.session.lastSynced = new Date().valueOf();

    // Initialize this to false if it's undefined:
    /*
    req.session.panicReceived = 
      req.session.panicReceived === undefined
        ? false : req.session.panicReceived;
    */

    // Keep track of pilot's name and system, from IGB headers if available: 
    req.session.pilot = {
      name: "Unknown Pilot",
      system: "Unknown System",
    };

    if(isTrusted){
      req.session.pilot.name = req.headers.eve_charname;
      req.session.pilot.system = req.headers.eve_solarsystemname;
    }

    // Set up local variables
    // Local variables are only for this request/response and will be used to populate jade templates
    res.locals.panicLog = req.session.panicLog;

    res.locals.pilot = {};
    if(isTrusted){
      console.log('we have trust');
      res.locals.isIGB = true;
      res.locals.pilot = req.session.pilot;
    } else {
      res.locals.isIGB = false;
    }

    console.log("End of catchall, session:")
    console.log(req.session)
    console.log("panicQueue.all:")
    console.log(panicQueue.all);
    // Proceed to the next route that matches this request path:
    next();
  });

  // Routes for dynamic pages (these use pubnub in the client html)
  app.get('/', function(req, res){
    res.redirect('/panicbutton')
  });

  app.get('/panicbutton', function(req, res){
    // Copy the flag that a panic was received or not into locals
    if(req.session.panicReceived){
      console.log('Panicking...')
    }
    res.locals.panicReceived = req.session.panicReceived;
    // Clear the flag
    req.session.panicReceived = false;
    res.render('panicbutton');
  });

  app.get('/standby', function(req, res){
    res.render('standby');
  });

  // Routes for static pages
  // These are for EVE IGB with limited browser support
  // These client pages only have href links. All pubnub is server side.

  app.get('/rest/panicbutton', function(req, res){
    res.render('rest-panicbutton');
  });

  app.get('/rest/standby', function(req, res){
    res.render('rest-standby');
  });

  // Static action routes 
  // These will be invoked from the above static pages
  // They will send pubnub messages

  app.all('/action*', function(req, res, next){
    if(!req.session.isTrusted){
      res.send(401, 
      "Please <a href='javascript:CCPEVE.requestTrust(\'http://localhost:3000\')>"
      + " grant trust</a> in EVE's Ingame Browser to use this app.")
    } else {
      next();
    }
  })

  app.get('/action/panic', function(req, res){
    var out = 'PANIC!!!' + '\n';
    //+ 'Headers ' + JSON.stringify(req.headers, null, 2);

    console.log(out);
    //req.session.panicReceived = true;
    pubnub.publish({
      channel: 'panic',
      message: {
        type: 'panic',
        pilot: req.session.pilot.name,
        system: req.session.pilot.system,
        date: new Date().valueOf(),
      },
      callback: function(err){
        //console.log(err);
        res.redirect('/rest/panicbutton');
      },
      error: function(err){
        //console.log(err);
        res.redirect('/rest/panicbutton');
      },
    })
  });

  app.get('/action/backup', function(req, res){
    var out = 'Sending backup' + '\n'
    + 'Headers ' + JSON.stringify(req.headers, null, 2);

    console.log(out);
    res.redirect('rest-standby');
  });

  app.get('/action/standdown', function(req, res){
    var out = 'Standing down' + '\n'
    + 'Headers ' + JSON.stringify(req.headers, null, 2);

    console.log(out);
    res.redirect('rest-standby');
  });

  app.get('/action/dismiss', function(req, res){
    var date2 = req.query['date'];
    if(date2 == false){    // including empty string
      res.send(500, 'Couldn\'t find the message to dismiss');
    } else {
      var filtered = req.session.panicLog.filter(function(msg){
        if(msg.date == date2){
          return false;
        } else {
          return true;
        }
      })
      req.session.panicLog = filtered;
      res.redirect('back');
    }
  });

}
