//angular.module("panic", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub', 'PanicStateService', 'PanicLogService'
,function ($scope, $rootScope, $element, PubNub, PanicStateService, PanicLogService) {
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
    $scope.panicloglines = PanicLogService.logBackup(payload.message);
    $scope.$apply();
  });

  // Send panics:
  $scope.broadcastPanic = function () {
    //var note = prompt('Describe your situation:', 'HALP!');
    PubNub.ngPublish({
      channel: 'panic',
      message: {
        pilot: $scope.pilotName,
        system: $scope.pilotSystem,
        time: new Date().valueOf,
      },
    });
  }

}]);