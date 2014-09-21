//angular.module("standby", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("standbyCtrl", ['$scope', '$rootScope', '$element', 'PubNub', 'PanicStateService'
,function ($scope, $rootScope, $element, PubNub, PanicStateService) {
  $scope.panicking = PanicStateService;
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
    //$scope.togglePanic(true);
    //console.log($scope.togglePanic);
    PanicStateService.start(payload.message);
    //$scope.togglePanic(true);
    //$scope.panic = payload.message;
    //console.log('standby.js: $scope.panicking', $scope.panicking)
  });

  // Send backup response:

  $scope.sendBackupMessage = function (data) {
    if(data.backup === true){
      var note = prompt('ETA and ship(s) responding?', 'OMW');
    }
    PubNub.ngPublish({
      channel: 'backup',
      message: {
        backup: data.backup,
        responder: $scope.pilotName,
        system: $scope.system,
        time: new Date().valueOf,
        note: note,
      },
    }); 
  }

  // Set button shortcuts to 'yes' and 'no' responses:
  $scope.respond = function (going) {
    if(!going){
      $scope.sendBackupMessage({backup: false});
    } else {
      $scope.sendBackupMessage({backup: true});
    }
    $scope.togglePanic(false)
  }
}]);
