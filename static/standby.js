//angular.module("standby", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("standbyCtrl", ['$scope', '$rootScope', '$element', 'PubNub', 'PanicStateService'
,function ($scope, $rootScope, $element, PubNub, PanicStateService) {
  //$scope.panicking = PanicStateService; // Apparently setting this equal to the Service object auto-watches it
  console.log('standby controller');
  // Prepare to send backup response:
  PubNub.ngGrant({
    channel: 'backup',
    read: true,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  // Prepare to listen for panics:
  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  // Listen for panics:
  PubNub.ngSubscribe({ channel: 'panic' })

  $rootScope.$on(PubNub.ngMsgEv('panic'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('someone panicked:', payload); 
    PanicStateService.start(payload.message);

    //$scope.togglePanic(true);
    //console.log($scope.togglePanic);
    //$scope.togglePanic(true);
    //$scope.panic = payload.message;
    //console.log('standby.js: $scope.panicking', $scope.panicking)
  });

  // Send backup response:

  $scope.sendBackupMessage = function (data) {
    PubNub.ngPublish({
      channel: 'backup',
      message: {
        backup: data.backup,
        responder: $scope.pilotName,
        system: $scope.pilotSystem,
        time: new Date().valueOf,
      },
    }); 
    PanicStateService.stop();
  }

  // Used by 'yes' and 'no' button responses:
  $scope.respond = function (going) {
    if(!going){
      $scope.sendBackupMessage({backup: false});
    } else {
      $scope.sendBackupMessage({backup: true});
    }
    //$scope.togglePanic(false)
  }
}]);
