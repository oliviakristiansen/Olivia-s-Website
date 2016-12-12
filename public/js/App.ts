namespace App {
    let app = angular.module ('App', ['ui.router']);

    app.config ([
        '$stateProvider',
        ($stateProvider: angular.ui.IStateProvider) => {
            $stateProvider
                .state ('home', {
                    url: '/',
                    templateUrl: 'templatesAdmin/home.html',
                    controller: App.HomeController,
                    controllerAs: 'homeController'
                })
                .state ('bio', {
                    url: '/bio',
                    templateUrl: 'templatesAdmin/bio.html',
                    controller: App.BioController,
                    controllerAs: 'bioController'
                })
        }
    ]);
}
