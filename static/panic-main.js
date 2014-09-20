var panicAppModule = angular.module("panicApp", ['ngMaterial', 'pubnub.angular.service'])
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {

  //
  // Scope Variables
  //
  $scope.CCPEVE = CCPEVE || null;
  $scope.panicking = false;

  $scope.pilot = {};
  $scope.pilotName = $('body').attr('data-pilot-name') || 'Unknown Pilot';
  $scope.system = $('body').attr('data-pilot-system') || 'Unknown System';
  $scope.panicDate = null;


  //
  // Scope Methods
  //
  $scope.hidePanicBanner = function(){
    $('.panicReceivedBanner').hide();
  }
  $scope.makeTrusted = function(){
    $scope.CCPEVE.requestTrust('http://localhost:3000');
    $('.trustBanner').hide();
    $('.refreshBanner').css('display', 'block');
  }
  $scope.refresh = function(){
    window.location.reload();
  }
  
  $scope.togglePanic = function(flag){
    if(flag===undefined){
      $scope.panicking = !$scope.panicking;
    } else {
      $scope.panicking = flag;
    }
  }


  // Init code
  PubNub.init({
    publish_key:'pub-c-bf1cbccf-f8bf-412a-8e2c-0930f6d87453',
    subscribe_key:'sub-c-5dfe513c-3fbe-11e4-98c8-02ee2ddab7fe',
    secret_key: "sec-c-YzM0OGY3ZmItOGMwNy00ODIzLWFjZjgtZTg4OGUwNzA3ZDRj",
    auth_key:"myAuthKey",
    uuid:$scope.pilotName,
  });
  
  PubNub.ngGrant({
    channel: 'panic',
    read: true,
    write: false,
    callback: function() {
      return console.log("Waiting for panic", arguments);
    }
  });

  PubNub.ngSubscribe({
    channel: 'panic'
  });
});