module.exports = function(panicPubnub){
  var panicQueue = {
    panics: [],
    backups: [],
    all: [],
    recent: {
      panics: getNewerPanics,
      backups: getNewerBackups,
      all: getNewerAll,
    },
  };

  // Filter out any messages that are older than dateMs
  function getNewer(messages, dateMs){
    var filtered = messages.filter(function(msg){
      if(msg.date > dateMs){ 
        return true; 
      } else {
        return false;
      }
    });
    return filtered;
  }

  function getNewerPanics(dateMs){
    return getNewer(panicQueue.panics, dateMs);
  }

  function getNewerBackups(dateMs){
    return getNewer(panicQueue.backups, dateMs);
  }
  
  function getNewerAll(dateMs){
    return getNewer(panicQueue.all, dateMs);
  }

  panicPubnub.events.on('panicMessage', function(event){
    console.log('Got panic message');
    console.log(event);
    panicQueue.panics.push(event);
    panicQueue.all.push(event);
  });

  panicPubnub.events.on('backupMessage', function(event){
    console.log('Got backup message');
    console.log(event);
    panicQueue.backups.push(event);
    panicQueue.all.push(event);
  });

  return panicQueue;
}