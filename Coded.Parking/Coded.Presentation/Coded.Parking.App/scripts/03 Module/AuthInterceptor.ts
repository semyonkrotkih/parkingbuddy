﻿module Parking {
    export class AuthInterceptor {
        public GetValue($q: ng.IQService, $window)
        {
            return {
                request(config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    return config;
                },
                response(response) {
                    if (response.status === 401) {
                        // handle the case where the user is not authenticated
                    }
                    return response || $q.when(response);
                }
            };
        }
        
    }
    AuthInterceptor.$inject = ['$rootScope', '$q', '$window'];
}