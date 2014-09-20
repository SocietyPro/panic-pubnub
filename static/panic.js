var panicModule = angular.module("panic", ['ngMaterial', 'pubnub.angular.service'])
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  // Prepare to send panics and listen for responses:
  PubNub.ngSubscribe({ channel: 'backup' })
  PubNub.ngGrant({
    channel: 'backup',
    read: false,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  PubNub.ngGrant({
    channel: 'panic',
    read: false,
    write: true,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  $rootScope.$on(PubNub.ngMsgEv('backup'), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a backup response:', payload);    
  });

  $scope.broadcastPanic = function (note) {
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