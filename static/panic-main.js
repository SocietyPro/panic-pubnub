try{
  if(CCPEVE === undefined){ var CCPEVE = null; }
} catch(e){ var CCPEVE = null; };

var panicMain = angular.module("panicMain", ['ngMaterial', 'pubnub.angular.service'])
.controller("panicMainCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  console.log('panic-main controller');

  //
  // Scope Variables
  //
  $scope.CCPEVE = CCPEVE;
  $scope.panicking = false;
  $scope.panic = {};
  $scope.nonIGB = !$('body').attr('data-is-igb');
  //$scope.pilot = {};
  $scope.pilotName = $('body').attr('data-pilot-name') || prompt('Your name?', 'Unknown Pilot');
  $scope.system = $('body').attr('data-pilot-system') || prompt('Your location?', 'Unknown System');
  $scope.panicDate = null;


  //
  // Scope Methods
  //
  $scope.hidePanicBanner = function(){
    $('.panicReceivedBanner').hide();
  }
  $scope.warnIGB = function () {
    $('.nonIGBBanner').show();
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
    console.log('togglePanic', flag, $scope.panicking);
    if(flag===undefined){
      $scope.panicking = !$scope.panicking;
    } else if(flag===true) {
      $scope.panicking = true;
      $('body').attr('panicking', 'true' )
    } else {
      $('body').removeAttr('panicking');
      $scope.panicking = false;
    }
  }

  // Init code
  PubNub.init({
    //publish_key:'pub-c-bf1cbccf-f8bf-412a-8e2c-0930f6d87453',
    //subscribe_key:'sub-c-5dfe513c-3fbe-11e4-98c8-02ee2ddab7fe',
    publish_key: 'pub-c-8d5479d1-7c2b-4e7f-88b5-caf6d89dd16b',
    subscribe_key:'sub-c-62d63d50-4009-11e4-82ce-02ee2ddab7fe',
    secret_key: "sec-c-YzM0OGY3ZmItOGMwNy00ODIzLWFjZjgtZTg4OGUwNzA3ZDRj",
    //auth_key:"myAuthKey",
    uuid:$scope.pilotName,
  });
}]);