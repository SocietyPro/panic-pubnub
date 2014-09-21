//angular.module("panic", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub', 'PanicStateService'
,function ($scope, $rootScope, $element, PubNub, PanicStateService) {
  console.log('panic controller');
  $scope.panicking = PanicStateService;
  // Prepare to send panics

  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  //Prepare to listen for backup responses:
  PubNub.ngGrant({
    channel: 'backup',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  // Listen for backup responses:
  PubNub.ngSubscribe({ channel: 'backup' })

  $rootScope.$on(PubNub.ngMsgEv('backup'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a backup response:', payload);    
  });

  // Send panics:
  $scope.broadcastPanic = function () {
    var note = prompt('Describe your situation:', 'HALP!');
    PubNub.ngPublish({
      channel: 'panic',
      message: {
        panicker: $scope.pilotName,
        system: $scope.system,
        time: new Date().valueOf,
        note: note,
      },
    });
  }

}]);