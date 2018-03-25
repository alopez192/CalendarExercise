app.controller("calendarAppCtrl", [
  "$scope",
  "$log",
  function($scope, $log) {
    $scope.calendarModel = {
      startDate: "",
      numberOfDays: 0,
      countryCode: ""
    };
  }
]);
