try{
  if(CCPEVE === undefined){ var CCPEVE = null; }
} catch(e){ var CCPEVE = null; };

var panicMain = angular.module("panicMain", ['ngMaterial', 'pubnub.angular.service']);

// Idea via http://stackoverflow.com/a/18193159/1380669
panicMain.service('PanicStateService', function ($rootScope) {
  var panicking = false;
  var details = null;
  return {
    panicking: panicking,
    start: function () {
      $('body').attr('panicking', 'true' )
      console.log('PanicStateService.start()')
      panicking = true; 
    },
    stop: function () { 
      $('body').removeAttr('panicking');
      console.log('PanicStateService.stop()')
      panicking = false; 
    },
    toggle: function () { panicking = !panicking; },
  };
});

panicMain.service('PanicLogService', function($rootScope){
  var testLine = {
    type: 'backup',
    msg: {
      backup: true,
      pilot: 'Chribba',
      system: 'Amarr',
      time: new Date().valueOf,
    }, 
  };
  var lines = [];
  return {
    lines: lines,
    logBackup: function(message){
      lines.push({
        type: 'backup',
        msg: message,
      })
      console.log(lines);
      return lines;
    },
    logPanic: function(message){
      lines.push({
        type: 'panic',
        msg: message,
      })
      console.log(lines);
      return lines;
    }
  }
})

panicMain.controller("panicMainCtrl", ['$scope', '$rootScope', '$element', 'PubNub', 'PanicLogService', 'PanicStateService'
,function ($scope, $rootScope, $element, PubNub, PanicLogService, PanicStateService) {
  console.log('panic-main controller');

  //
  // Scope Variables
  //
  $scope.CCPEVE = CCPEVE;
  $scope.panicking = PanicStateService;
  $scope.paniclog = PanicLogService;
  //$scope.panicloglines = [];
  $scope.nonIGB = !$('body').attr('data-is-igb');
  $scope.pilotName = $('body').attr('data-pilot-name') || 'Pilot '+ Math.floor(Math.random()*10000);
  $scope.pilotSystem = $('body').attr('data-pilot-system') || 'Unknown system';
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
  
  /*
  $scope.togglePanic = function(flag){
    console.log('togglePanic', flag, PanicStateService.panicking);
    if(flag===undefined){
      //$scope.panicking = !$scope.panicking;
      PanicStateService.toggle();
    } else if(flag===true) {
      //$scope.panicking = true;
      //.$('body').attr('panicking', 'true' )
      PanicStateService.start();
    } else {
      //$('body').removeAttr('panicking');
      //$scope.panicking = false;
      PanicStateService.stop();
    }
    console.log('new panicking value:', $scope.panicking);
  }
  */

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