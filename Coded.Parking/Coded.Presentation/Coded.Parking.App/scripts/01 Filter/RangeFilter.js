var Parking;
(function (Parking) {
    function RangeFilter() {
        return function (input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i = min; i < max + 1; i++)
                input.push(i);
            return input;
        };
    }
    Parking.RangeFilter = RangeFilter;
})(Parking || (Parking = {}));
//# sourceMappingURL=RangeFilter.js.map