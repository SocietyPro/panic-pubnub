var standbyModule = angular.module("standby", ['ngMaterial', 'pubnub.angular.service'])
.controller("standbyCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  $scope.pilot = {};
  $scope.pilot.name = $('body').attr('data-pilot-name') || 'Unknown Pilot';
  $scope.pilot.loc = $('body').attr('data-pilot-loc') || 'Unknown System';
  $scope.panicTime = null;

  PubNub.init({
    publish_key:'pub-c-bf1cbccf-f8bf-412a-8e2c-0930f6d87453',
    subscribe_key:'sub-c-5dfe513c-3fbe-11e4-98c8-02ee2ddab7fe',
    secret_key: "sec-c-YzM0OGY3ZmItOGMwNy00ODIzLWFjZjgtZTg4OGUwNzA3ZDRj",
    auth_key:"myAuthKey",
    uuid:$scope.name,
  });
  
  PubNub.ngGrant({
    channel: 'rvb_ganked',
    read: true,
    write: true,
    callback: function() {
      return console.log("channel all set", arguments);
    }
  });

  $scope.testVar = 'Test Scope Variable';
  $scope.panicking = false;
  $scope.panic = function(){
    $event.preventDefault();
    $scope.panicking = true;
  }
  $scope.stopPanicking = function(data){
    $scope.panicking = false;
    if(data.backup){
      sendBackupMessage();
    }
  };
  $scope.togglePanic = function(){
    $scope.panicking = !$scope.panicking;
  }
}]);
