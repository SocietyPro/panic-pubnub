//angular.module("standby", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("standbyCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  console.log('standby controller');
  // Prepare to listen for panics and respond:
  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });
  PubNub.ngSubscribe({ channel: 'panic' })

  PubNub.ngGrant({
    channel: 'backup',
    read: true,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });



  $rootScope.$on(PubNub.ngMsgEv('panic'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('someone panicked:', payload); 
    //$scope.togglePanic(true);
    $scope.togglePanic();
    $scope.panic = payload.message;
  });

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

  $scope.respond = function (going) {
    if(!going){
      sendBackupMessage({backup: false});
    } else {
      sendBackupMessage({backup: true});
    }
    $scope.togglePanic(false)
  }
}]);
