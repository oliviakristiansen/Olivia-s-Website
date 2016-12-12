namespace App {
    export class HomeController {
        static $inject = [];

        public title;

        constructor () {
            this.title = "Olivia Lemmelin Webpage";
        }
        public testMethod() {
            console.log ("Hello! I was clicked!");
            this.title = "Olivia Lemmelin Webpage";
        }
    }
}
