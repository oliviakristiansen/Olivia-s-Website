//Pull in express to make use of the framework.
var express = require ('express');

//Grab the url router from express.
var router = express.Router ();

//Load in the Lesson schema object.
var Lesson = require ('../model/basic.js')

var moment = require ('moment');

// - Lesson
//        - CRUD
//            - Create
//                GET     /lesson/create       Show a form for creating a new order.
//                POST    /lesson              Save the data from the create form.
//
//            - Read
//                GET     /lesson              Show a list of all lessons.
//                GET     /lesson/:id          Show an order by a specific id.
//
//            - Update
//                GET     /lesson/:id/edit     Show a form for editing a specific order by id.
//                PUT     /lesson/:id          Update a specific order using the data from the edit form.
//
//            - Delete
//                DELETE  /lesson/:id          Delete a specific order.

//---CRUD operations----

// Create
router.get ('/create', function (request, response) {
    // response.send ('You are on the create page!');
    response.render ('lessons/create')
});

router.post ('/', function (request, response) {
    // -------------------------------------------------------
    // Convert the time sent down by the 'request.body.time' to
    // always be formatted in military time.

    // Use the moment library to parse out the time string.
    var time = moment (request.body.time);

    // Update the request body's time property to use the newly
    // formated time that is in military time format.
    request.body.time = time.format ('HH:mm');

    console.log ('*** Body: ', request.body.time);

    // -------------------------------------------------------
    // Save the lesson.
    var newLesson = Lesson (request.body);
    newLesson.save (function (error) {
        if (error) {
            var errorMessage = 'Unable to save the lesson';
            console.log ('***ERROR: ' + errorMessage);
        }
        else {
            // console.log ('HELP', request.sendJson);
            if (request.sendJson == true) {
                response.json ({
                    message: 'New lesson was saved.'
                });
            }
            else {
                response.redirect ('/lesson');
            }
        }
    });
});


//Read
router.get ('/',function (request, response) {
    // response.send ('You are reading a lesson');
    // response.render ('lessons/request');
    // Lesson.find ({}, function (error, result) {
    //     if (error) {
    //         var errorMessage = 'Unable to load lesson';
    //         console.log ('***ERROR: ' + errorMessage);
    //     }
    //     else {
    //         response.render ('lessons/request', {
    //             data: {
    //                 lessons: result
    //             }
    //         });
    //     }
    // });

    var filter = {status: 'active'};
    if (request.body.day) {
        filter.day = request.body.day;
        // filter.email = request.session.user.email;
    }
    // console.log ('TESTING', request.body.date);
    Lesson.find (filter).sort('time').exec(function (error, result) {
        if (error) {
            var errorMessage = 'Unable to sort lessons';
            console.log ('***ERROR: ' + errorMessage);
        }
        else {
            if (request.sendJson == true) {
                response.json (result);
            }
            else {
                response.render ('lessons/request', {
                    data: {
                        lessons: result
                    }
                });
            }
        }
    });

});

router.get ('/:id', function (request, response) {
    // response.send ('Lesson by id.');
    //Grab the lesson id by the '/:id' value in the url path.
    var lessonId = request.params.id

    Lesson.findById (lessonId, function (error, result) {
        // response.send ('This is the specific order: ' + request.params.id);
        if (error) {
            var errorMessage = 'Unable to find lesson by id: ' + lessonId;
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            if (request.sendJson == true) {
                response.json (result);
            }
            else {
                response.render ('lessons/view', {
                    data: {
                        lesson: result
                    }
                });
            }
        }
    });
});

//Update
router.get ('/:id/edit', function (request, response) {
    // response.send ('Edit a lesson');

    //Grab the lesson id by the '/:id' value in the url path.
    var lessonId = request.params.id;

    //Run a query for our product to an id.
    Lesson.findById (lessonId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to find lesson by id.' + lessonId;
            console.log ('****ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            response.render ('lessons/edit', {
                data: {
                    lesson: result,
                    title: 'Edit',
                    method: 'PUT'
                }
            });
        }
    });
});

router.put ('/:id', function (request, response) {
    var lessonId = request.params.id;

    Lesson.findByIdAndUpdate (lessonId, request.body, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to update lesson' + lessonId;
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            if (request.sendJson == true) {
                response.json ({
                    message: 'Lesson was updated.'
                });
            }
            else {
                response.redirect ('/lesson/' + lessonId);
            }
        }
    });
});

//Delete
router.get ('/:id/delete', function (request, response) {
    // response.send ('Lesson was deleted');
    var lessonId = request.params.id;

    Lesson.findByIdAndRemove (lessonId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to delete lesson' + lessonId;
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'Lesson was deleted.'
                });
            }
            else {
                response.redirect ('/lesson/')
            }
        }
    })
});

router.delete ('/:id', function (request, response) {
    var lessonId = request.params.id;

    Lesson.findByIdAndRemove (lessonId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to delete lesson.' + lessonId;
                console.error ('***ERROR: ' + errorMessage);
                response.send (errorMessage);
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'Lesson was deleted.'
                });
            }
            else {
                response.redirect ('/lesson/');
            }
        }
    });
});


module.exports = router;
