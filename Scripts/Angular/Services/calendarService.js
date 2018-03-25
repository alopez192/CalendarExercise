app.service("CalendarService", [
  "$http",
  function($http) {
    this.getHolidaysByYear = function(countryCode, year) {
      return $http({
        url: "https://holidayapi.com/v1/holidays",
        method: "GET",
        params: {
          key: "36ff1ab5-0841-4825-b54a-ee096d4ba4d9",
          country: countryCode,
          year: year
        }
      }).then(function(response) {
        return response.data;
      });
    };
  }
]);
