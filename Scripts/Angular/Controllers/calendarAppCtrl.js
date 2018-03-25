app.controller("calendarAppCtrl", [
  "$scope",
  "$log",
  "CalendarService",
  function($scope, $log, CalendarService) {
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
      countryCode: "",
      holidays: []
    };

    $scope.isValidModel = function() {
      if (
        $scope.calendarModel.startDate !== "" &&
        $scope.calendarModel.numberOfDays !== 0 &&
        $scope.calendarModel.countryCode !== ""
      ) {
        return true;
      }
      return false;
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
        for (
          var j = startMon;
          j <= endMonth;
          j = j > 12 ? j % 12 || 11 : j + 1
        ) {
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

    /*
        according to requested calendar, we can set up the month calendar as a matrix of 8x7 (when full month) and create it using <table> HTML element.
        First row will always have the same headers indicating the current date, starting on Sunday and ending on Saturday.
    */
    $scope.printCalendarDaysHeaders = function() {
      var daysHeaders = "<tr>";
      for (let i = 0; i < 7; i++) {
        daysHeaders += "<th>" + WEEK_DAYS[i].substr(0, 1) + "</th>"; //display only the first character of the day to match word sample
      }
      return daysHeaders + "</tr>";
    };

    /* 
        Similar to 'printCalendarDaysHeaders', the second row will indicate the month header (Month name and Year) 
        and this needs to cover all the 7 columns for the 7 days of the week
    */
    $scope.printCalendarHeader = function(date) {
      var calendarHeader =
        '<th colspan="7">' +
        $scope.getMonthName(date.getMonth()) +
        " " +
        date.getFullYear() +
        "</th>";
      '<th colspan="7">' +
        $scope.getMonthName(date.getMonth()) +
        " " +
        date.getFullYear() +
        "</th>";
      return calendarHeader;
    };

    /*
        To create the full calendar we need to have start and end date. *PLEASE NOTE* that this date range MUST be for the same month
        in order for this function to create calendar one by one.
    */
    $scope.printCalendarHtml = function(startDate, endDate) {
      //we need to get the last day of the previous month in order to know in wich day of the third row (8x7) we are going to start to print the month calendar days
      var previousMonth = new Date(startDate);
      previousMonth.setDate(0); //get last day of the previous month

      var currentDay = 0;
      var calendarHtml = "<table>";

      //set the startIndex for current month
      var lastDayPreviousMonth = previousMonth.getDay() + 1;
      var isStartWeek = lastDayPreviousMonth == 7;

      for (let row = 0; row < 8; row++) {
        calendarHtml += "<tr>";
        switch (row) {
          case 0: //get calendar days headers
            calendarHtml += $scope.printCalendarDaysHeaders();
            break;
          case 1: //get month with year calendar main header
            calendarHtml += $scope.printCalendarHeader(startDate);
            break;
          default:
            //here is where we are going to create the body of the calendar indicating the days
            var invalidCellsCount = 0; //know if the FULL ROW (7 cells are empty) is invalid so, we don't display this row to match word sample
            var rowCells = "";

            for (let column = 0; column < 7; column++) {
              var className =
                column == 0 || column == 6 ? "weekends" : "weekdays";

              var currentDateKey = $scope.formatDate(
                new Date(
                  startDate.getFullYear(),
                  startDate.getMonth(),
                  currentDay
                )
              );

              if ((row == 2 && column == lastDayPreviousMonth) || isStartWeek) {
                currentDay = 1;
                isStartWeek = false;
              }
              if (
                currentDay !== 0 &&
                currentDay >= startDate.getDate() &&
                currentDay <= endDate.getDate()
              ) {
                className = $scope.calendarModel.holidays[currentDateKey]
                  ? "holiday"
                  : className;
                var holidayToolTip =
                  className == "holiday"
                    ? 'title="' +
                      $scope.calendarModel.holidays[currentDateKey][0].name +
                      '"'
                    : "";
                //here we are going to create all valid days in the calendar based on the start and end date
                rowCells +=
                  '<td class="' +
                  className +
                  '"' +
                  holidayToolTip +
                  ">" +
                  currentDay++ +
                  "</td>";
                continue;
              }
              if (currentDay >= 1) {
                currentDay++;
              }
              rowCells += '<td class="invalidDay"></td>'; //days that are not part of the date range are marked as invalidDay
              invalidCellsCount++;
            }

            if (invalidCellsCount !== 7) {
              //check if FULL ROW is not invalid
              calendarHtml += rowCells;
            }
            break;
        }
        calendarHtml += "</tr>";
      }
      calendarHtml += "</table>";
      return calendarHtml;
    };

    /*******************************************************************************************************************
     *                                          Print Result functions section
     *******************************************************************************************************************/

    $scope.generateCalendarsOutput = function(selectedDate, selectedEndDate) {
      var calendars = "";
      var selectedDates = $scope.getDistinctMonths(
        selectedDate,
        selectedEndDate
      );
      if (selectedDates.length > 1) {
        for (let index = 0; index < selectedDates.length; index++) {
          var date = selectedDates[index];
          //print for all dates except last one that we need to check if date is not the last day of that month
          if (date != selectedDates[selectedDates.length - 1]) {
            var endDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              $scope.getDaysInMonth(date.getMonth() + 1)
            ); //this is to get full month calendar for those dates are between the start and end date
            calendars += "<br><br>" + $scope.printCalendarHtml(date, endDate);
          } else {
            //if selected date range covers only one month
            date.setDate(1); //set the date to the first day of the month
            calendars +=
              "<br><br>" + $scope.printCalendarHtml(date, selectedEndDate);
          }
        }
      } else {
        calendars +=
          "<br><br>" + $scope.printCalendarHtml(selectedDate, selectedEndDate);
      }

      $scope.printCalendarResults(calendars);
    };

    $scope.generateCalendarsHtml = function() {
      if ($scope.isValidModel()) {
        $scope.logModelInfo();
        var selectedDate = new Date($scope.calendarModel.startDate);
        //get end date based on the quantity of days entered by the user
        var selectedEndDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate() + ($scope.calendarModel.numberOfDays - 1)
        );

        if (
          selectedDate.getFullYear() == selectedEndDate.getFullYear() &&
          selectedDate.getFullYear() < new Date().getFullYear()
        ) {
          var holidaysData = CalendarService.getHolidaysByYear(
            $scope.calendarModel.countryCode,
            selectedDate.getFullYear()
          );
          holidaysData.then(
            function(result) {
              $scope.calendarModel.holidays = result.holidays;
              $scope.generateCalendarsOutput(selectedDate, selectedEndDate);
            },
            function(errorReponse) {
              $log.error(errorReponse);
              $scope.generateCalendarsOutput(selectedDate, selectedEndDate);
            }
          );
        } else {
          $scope.generateCalendarsOutput(selectedDate, selectedEndDate);
        }
      }
    };

    $scope.logModelInfo = function() {
      console.clear();
      $log.debug("Start Date: " + $scope.calendarModel.startDate);
      $log.debug("Number of Days: " + $scope.calendarModel.numberOfDays);
      $log.debug("Country Code: " + $scope.calendarModel.countryCode);
    };

    $scope.printCalendarResults = function(calendarResultsHtml) {
      document.getElementById("calendarResults").innerHTML = ""; //clear previous results
      document.getElementById(
        "calendarResults"
      ).innerHTML = calendarResultsHtml;
    };
  }
]);
