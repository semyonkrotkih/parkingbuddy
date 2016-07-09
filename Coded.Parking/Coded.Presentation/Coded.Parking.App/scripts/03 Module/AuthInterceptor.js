var Parking;
(function (Parking) {
    var AuthInterceptor = (function () {
        function AuthInterceptor() {
        }
        AuthInterceptor.prototype.GetValue = function ($q, $window) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    return config;
                },
                response: function (response) {
                    if (response.status === 401) {
                    }
                    return response || $q.when(response);
                }
            };
        };
        return AuthInterceptor;
    })();
    Parking.AuthInterceptor = AuthInterceptor;
    AuthInterceptor.$inject = ['$rootScope', '$q', '$window'];
})(Parking || (Parking = {}));
//# sourceMappingURL=AuthInterceptor.js.map