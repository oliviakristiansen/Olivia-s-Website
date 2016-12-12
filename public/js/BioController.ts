namespace App {
    export class BioController {
        static $inject = [];

        public title;

        constructor () {
            this.title = "Biography";
        }
        public testMethod() {
            console.log ("Hello! I was clicked!");
            this.title = "Olivia Lemmelin Bio";
        }
    }
}
