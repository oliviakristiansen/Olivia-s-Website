namespace App {
    let app = angular.module ('App');

    export class UserService {
        static $inject =['$http', '$state'];

        private httpService;
        private stateService;

        private user;

        constructor ($httpService: angular.IHttpService, $stateService: angular.ui.IStateService) {
            this.httpService = $httpService;
            this.stateService = $stateService;
            console.log ('User Service loaded...');

            this.getSessionUser ()
                .success ((response) => {
                    console.log ('Got user Response: ', response);
                })
                .error ((response) => {
                    console.error ('Unable to get user session info: ', response);
                })
        }

        public getSessionUser () {
            let promise = this.httpService ({
                url: '/user/session',
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: {}
            })
            return promise;
        }
        public checkRole (role) {
            let hasRole = false;

            if (this.user) {
                if (this.user.type == role) {
                    hasRole = true;
                }

                if (hasRole == true) {
                    return hasRole;
                }
                else {
                    console.error ('You do not has access to this page.');
                    this.stateService.go ('error');
                }
            }
            else {
                window.location.href = '/login';
                return;
            }
        }

        public setUser (user) {
            this.user = user;
        }

        static resolveSessionUser = [
            '$http', 'UserService',
            function ($http, UserService) {
                console.log ('Getting the session user.');
                return $http ({
                    url: '/user/session',
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    data: {}
                })

                .then (function (response) {
                    console.log ('Got session user data: ', response);
                    UserService.setUser (response.data);
                })
            }
        ]
    }

    app.service ('UserService', UserService);
}
