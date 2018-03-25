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

    $scope.calendarModel = { startDate: "", numberOfDays: 0, countryCode: "" };

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

    //get all months that are between two dates (start and end date).
    $scope.getDistinctMonths = function(startDate, endDate) {
      var start = $scope.formatDate(startDate).split("-");
      var end = $scope.formatDate(endDate).split("-");
      var startYear = parseInt(start[0]);
      var endYear = parseInt(end[0]);
      var dates = [];

      for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
          var month = j + 1; //JS Dates months are from 0-11
          var displayMonth = month < 10 ? "0" + month : month;
          var displayDay = "";
          if (i === parseInt(start[0]) && j === parseInt(start[1]) - 1) {
            //get the day of the start date
            displayDay = start[2];
          } else if (i === parseInt(end[0]) && j === parseInt(end[1]) - 1) {
            //get the day of the end date
            displayDay = end[2];
          } else {
            //set date to first day of the month for all other month that are between start and end date
            displayDay = "01";
          }
          var date = [i, displayMonth, displayDay].join("-") + " 00:00:00"; //add time to get selected date
          dates.push(new Date(date));
        }
      }
      return dates;
    };

    /*******************************************************************************************************************
     *                                          Print Result functions section
     *******************************************************************************************************************/

    $scope.generateCalendarsHtml = function() {
      if (
        $scope.calendarModel.startDate !== "" &&
        $scope.calendarModel.numberOfDays !== 0
      ) {
        $scope.logModelInfo();
        var selectedDate = new Date($scope.calendarModel.startDate);
        var selectedEndDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate() + ($scope.calendarModel.numberOfDays - 1)
        );

        $log.debug($scope.getDistinctMonths(selectedDate, selectedEndDate));
      }
    };

    $scope.logModelInfo = function() {
      console.clear();
      $log.debug("Start Date: " + $scope.calendarModel.startDate);
      $log.debug("Number of Days: " + $scope.calendarModel.numberOfDays);
      $log.debug("Country Code: " + $scope.calendarModel.countryCode);
    };
  }
]);
