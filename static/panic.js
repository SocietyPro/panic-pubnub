//angular.module("panic", ['ngMaterial', 'pubnub.angular.service'])
panicMain
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  console.log('panic controller');
  // Prepare to send panics and listen for responses:
  PubNub.ngGrant({
    channel: 'backup',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });
  PubNub.ngSubscribe({ channel: 'backup' })

  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  $rootScope.$on(PubNub.ngMsgEv('backup'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a backup response:', payload);    
  });

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