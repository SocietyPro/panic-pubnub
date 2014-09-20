var panicAppModule = angular.module("panicApp", ['ngMaterial', 'pubnub.angular.service'])
.controller("panicCtrl", ['$scope', '$rootScope', '$element', 'PubNub'
,function ($scope, $rootScope, $element, PubNub) {
  $scope.pilot = {};
