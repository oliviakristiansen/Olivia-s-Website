namespace App {
    let app = angular.module ('App', ['ui.router']);

    app.config ([
        '$stateProvider',

        ($stateProvider) => {

            $stateProvider
                .state ('home', {
                    url: '/',
                    // template: 'Here we are at home.'
                    templateUrl: '/js/templates/partials/home.html',
                    controller: App.HomeController,
                    controllerAs: 'homeController'
                })
                .state ('bio', {
                    url: '/bio',
                    // template: 'Here we are at bio.'
                    templateUrl: '/js/templates/partials/bio.html',
                    controller: App.BioController,
                    controllerAs: 'bioController'
                })
                .state ('lesson', {
                    url: '/lesson',
                    // template: 'Here we are at lessons.'
                    templateUrl: '/js/templates/partials/lessons/list.html',
                    controller: App.LessonController,
                    controllerAs: 'lessonController'
                })
                .state ('lesson-create', {
                    url: '/lesson/create',
                    // template: 'Here we are at create.'
                    templateUrl: '/js/templates/partials/lessons/edit.html',
                    controller: App.LessonController,
                    controllerAs: 'lessonController'
                })
                .state ('lesson-view', {
                    url: '/lesson/:id',
                    // template: 'Here we are at view.'
                    templateUrl: '/js/templates/partials/lessons/view.html',
                    controller: App.LessonController,
                    controllerAs: 'lessonController'
                })
                .state ('lesson-edit', {
                    url: '/lesson/:id',
                    // template: 'Here we are at edit.'
                    templateUrl: '/js/templates/partials/lessons/edit.html',
                    controller: App.LessonController,
                    controllerAs: 'lessonController'
                })
            ;
        }
    ])
}
