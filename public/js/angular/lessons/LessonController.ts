namespace App {
    export class LessonController {
        static $inject = ['LessonService', '$state', '$stateParams'];

        private lessonService;
        private stateService;
        private stateParamsService;

        public lesson;
        public list;
        public mode;

        constructor (lessonService: App.LessonService, $state: angular.ui.IStateProvider, $stateParams: angular.ui.IStateParamsService) {
            console.log ('LessonController was loaded...');
            console.log ('Lesson Service', lessonService);

            this.lessonService = lessonService;
            this.stateService = $state;
            this.stateParamsService = $stateParams;

            // This is pulling in the information and you can read it
            //by the id.
            if (this.stateParamsService.id) {
                this.read (this.stateParamsService.id);
            }

            console.log ('Current route: ', this.stateService.current);
            if (this.stateService.current.name == 'lesson-edit') {
                this.mode = 'edit';
            }
            else if (this.stateService.current.name == 'lesson-create') {
                this.mode = 'create';
            }
        }

        public create (id) {
            if (id) {
                console.log ('Creating a lesson.');
                this.update (id);
            }
            else {
                console.log ('Creating a new lesson');
                console.log ('Lesson has been saved.', this.lesson);
                this.lessonService.create (this.lesson)
                    .success ((response) => {
                        this.stateService.go ('lesson');
                    })
                    .error ((response) => {
                        console.error ('Unable to create the product: ', response);
                    })
            }
        }

        public read (id) {
            console.log ('Lessons have been read.', this.list);
            this.lessonService.read (id)
                .success ((response) => {
                    if (id) {
                        this.lesson = response;
                    }
                    else {
                        this.list = response;
                    }
                })
                .error ((response) => {
                    console.error ('There was an error');
                })
        }

        public update (id) {
            this.lessonService.update (id, this.lesson)
                .success ((response) => {
                    this.goToPage ('lesson-view', { id: id});
                })
                .error ((response) => {
                    console.error ('Unable to update the lesson: ', response);
                })
        }

        public delete (id) {
            console.log ('Deleted!', id);

            this.lessonService.delete (id)
                .success ((response) => {
                    console.log ('Lesson deleted successfully', response);

                    this.stateService.go ('lesson')
                })
                .error ((response) => {
                    console.error ('Error Deleting Lesson', response);
                })
        }

        public goToPage (route, data) {
            console.log ('Here is the data...', route, data);
            this.stateService.go (route, data);
        }
    }
}
