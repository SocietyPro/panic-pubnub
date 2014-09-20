var standbyModule = angular.module("standby", ['ngMaterial', 'pubnub.angular.service'])
.controller("standbyCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  // Prepare to listen for panics and respond:
  PubNub.ngSubscribe({ channel: 'panic' })

  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  PubNub.ngGrant({
    channel: 'backup',
    read: false,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });



  $rootScope.$on(PubNub.ngMsgEv('panic'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('someone panicked:', payload);    
  });

  $scope.respond = function (response) {
    if(!response){
      sendBackupMessage({
        backup: false,
        pilot: $scope.name,
      });
    } else {
      sendBackupMessage({
        backup: true,
        pilot: $scope.name,
        backupSystem: $scope.system,
        response: response,
      })
    }
  }
}]);
