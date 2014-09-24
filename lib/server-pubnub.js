var events = require('events')
module.exports = function(PUBNUB){
  var panicPubnub = {};
  panicPubnub.events = new events.EventEmitter();

  var pubnub = PUBNUB.init({
    publish_key:'pub-c-8d5479d1-7c2b-4e7f-88b5-caf6d89dd16b',
    subscribe_key:'sub-c-62d63d50-4009-11e4-82ce-02ee2ddab7fe',
    uuid: "panic-app",
    ssl:true,
    cipher_key: 'my_super_secret_cipherkey'
  })

  panicPubnub.pubnub = pubnub;

  // Listen for pubnub panics:
  console.log('Subscribing to panic...');
  pubnub.subscribe({
    restore: false,
    channel: 'panic',
    connect: function (connect) {
      console.log("connnected to panic with SSL and AES encryption");
      panicPubnub.events.emit('connected', 'panic');
      /*
      pubnub.here_now({
        channel: "panic",
        callback: function (u) {
          // Load userlist into session
        }
      });
      */
    },
    message: function(m){
      panicPubnub.events.emit('panicMessage', m)
    },
    presence: function( message, env, channel ) {
      /*
      $rootScope.$apply(function  () {
        if (message.action == "join") {
          $rootScope.users.push(message.uuid);
        } else {
          $rootScope.users.splice($rootScope.users.indexOf(message.uuid), 1);
        }
      });
      */
    }
  });

  console.log('Subscribing to backup...');
  // Listen for pubnub backup message:
  pubnub.subscribe({
    restore: false,
    channel: 'backup',
    connect: function (connect) {
      console.log("connnected to backup with SSL and AES encryption");
      panicPubnub.events.emit('connected', 'backup');
      /*
      pubnub.here_now({
        channel: "backup",
        callback: function (u) {
          // Load userlist into session
        }
      });
      */
    },
    message: function(m){
      panicPubnub.events.emit('backupMessage', m)
    },
    presence: function( message, env, channel ) {
      /*
      $rootScope.$apply(function  () {
        if (message.action == "join") {
          $rootScope.users.push(message.uuid);
        } else {
          $rootScope.users.splice($rootScope.users.indexOf(message.uuid), 1);
        }
      });
      */
    }
  });

  return panicPubnub;
}