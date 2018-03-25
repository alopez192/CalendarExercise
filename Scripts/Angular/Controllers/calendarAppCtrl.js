app.controller("calendarAppCtrl", [
  "$scope",
  "$log",
  function($scope, $log) {
    /*******************************************************************************************************************
     *                                          Constants section
     *******************************************************************************************************************/
    const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const WEEK_DAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    /*******************************************************************************************************************
     *                                          Calendar Model section
     *******************************************************************************************************************/

    $scope.calendarModel = {
      startDate: "",
      numberOfDays: 0,
      countryCode: ""
    };

    /*******************************************************************************************************************
     *                                          Date functions section
     *******************************************************************************************************************/
    //get total days for a specific month. this will allow to iterate over month calendar
    $scope.getDaysInMonth = function(month) {
      return new Date(new Date().getFullYear(), month, 0).getDate();
    };

    //get month name for a specific month index
    $scope.getMonthName = function(month) {
      return MONTH_NAMES[month];
    };

    //format date as string YYYY-MM-DD
    $scope.formatDate = function(date) {
      var formattedDate = "";
      var year = date.getFullYear();
      var month =
        date.getMonth() < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var formattedDate = year + "-" + month + "-" + day;
      return formattedDate;
    };

    /*******************************************************************************************************************
     *                                          Print Result functions section
     *******************************************************************************************************************/

    $scope.generateCalendarsHtml = function() {
      if (
        $scope.calendarModel.startDate !== "" &&
        $scope.calendarModel.numberOfDays !== 0
      ) {
        console.clear();
        $log.debug("Start Date: " + $scope.calendarModel.startDate);
        $log.debug("Number of Days: " + $scope.calendarModel.numberOfDays);
        $log.debug("Country Code: " + $scope.calendarModel.countryCode);
      }
    };
  }
]);
