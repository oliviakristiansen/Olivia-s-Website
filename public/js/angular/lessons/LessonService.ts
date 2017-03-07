namespace App {
    let app = angular.module ('App');

    export class LessonService {
        static $inject = ['$http'];

        private httpService;

        constructor ($httpService: angular.IHttpService) {
            console.log ('Lesson Service was loaded...');
            this.httpService = $httpService;
        }

        public create (lesson) {
            let promise = this.httpService ({
                url: '/lesson',
                method: 'POST',
                data: lesson,
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            console.log ('PRomise', promise);
            return promise;
        }

        public read (id) {
            let url = '/lesson';

            //If a valid id was passed in, modify the url.
            if (id) {
                url = url + '/' + id;
            }

            let promise = this.httpService ({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: {}
            });

            return promise;
        }

        public update (id, lesson) {
            let promise = this.httpService ({
                url: '/lesson/' + id,
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: lesson
            });

            return promise;
        }

        public delete (id, lesson) {
            let promise = this.httpService ({
                url: '/lesson/' + id + '/delete',
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: lesson
            });

            return promise;
        }
    }

    app.service ('LessonService', LessonService);
}
