module Parking {
    export function RangeFilter() {
        return function (input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i = min; i < max+1; i++)
                input.push(i);
            return input;
        };
    }
}