//Pull in express to make use of the framework.
var express = require ('express');

//Grab the url router from express.
var router = express.Router ();


//Load in the Lesson schema object.
var Lesson = require ('../model/basic.js')

//Bring in the multer library to handle the multi part upload files.
var multer = require ('multer');

//Create a multer function to handle the multi part files.
//need to make a temp folder in project.
var processUploadFile = multer ({ dest: './temp'});

router.get ('/', function (request, response) {
    // response.send ('This is the home page');
    // console.log ('HOME PAGE');
    response.render ('home');
});

//This route recieves data from the lesson form.
router.post ('/', function (request, response) {
    // response.send ('You created a lesson!');

    //Create the parts of the email.
    var toList = [
        {
            email: request.body.email
        },
        {
            email: 'olivialemmelin@gmail.com'
        }
    ]

    var emailTitle = 'You have requested a lesson with Olivia!';
    var emailBody = 'Thanks for requesting a lesson ' + request.body.firstName + '! She is super excited to teach you. She will review your information and will email you directly. Thanks! ' + JSON.stringify(request.body);

    console.log ('HEREEEE');
    //Create a new lesson from the data sent down by form or API post.

    request.body.status = 'pending';
    request.body.owner = request.session.user;

    var requestLesson = Lesson (request.body);
    // requestLesson.status = 'pending';
    // requestLesson.owner = request.session.user.id;

    console.log ('user: ', request.session.user);
    console.log ('data: ', request.body);

    requestLesson.save (function (error, lesson) {
        if (error) {
            console.error ('***ERROR: Unable to save the lesson.');
            console.error (error);
        }
        else {
            //Link the lesson to the user that is currently logged in.
            var user = request.session.user;
            lesson.owner = user;

            //Send a confirmation email.
            //Load in the http request module.
            var httpRequest = require ('request');

            console.log ('Lesson has been saved to db: ', lesson);
            //Make a request to the Sendgrid API service.
            httpRequest (
                //Pass the configuration object with where to make the call.
                {
                    method: 'POST',
                    url: 'https://api.sendgrid.com/v3/mail/send',
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json'
                    },

                    //The JSON or form data to send with the request.
                    json: {
                        //The email subject and recipients.
                        personalizations: [
                            {
                                //An array of objects so you can send to many different emails.
                                to: toList,
                                subject: emailTitle
                            }
                        ],
                        from: {
                            email: 'no-reply@lesson.com'
                        },
                        content: [
                            {
                                type: 'text/html',
                                value: emailBody
                            }
                        ]
                    }
                }
                // function (error, req, body) {
                //     if (error) {
                //         console.error ('***ERROR', error);
                //         console.error ('***ERROR', body);
                //         return;
                //
                //     }
                //     console.log ('request reply: ', req.statusCode);
                //     //.flash and .redirect should be paired together because you want the
                //     //flash message to show up when you redirect to the page.
                // }
            )
            // .on is chained so you only need one ; at the end of all the .on calls.
            .on ('response', function (requestReply) {
                console.log ('request reply: ', requestReply.statusCode);
                request.flash ('success', 'Lesson was requested.');
                response.redirect ('/lesson');

            })
            .on ('error', function () {
                response.error ('There was a problem sending the request email.');
            })
            ;
        }
    })
    // if (request.sendJson) {
    //     response.json ({
    //         message: 'New lesson was saved.'
    //     });
    // }
    // else {
    //     //Add a flash message of our success.
    //     request.flash ('success', 'Lesson was requested.');
    //
    //     //Redirect back to the lesson page.
    //     response.redirect ('/lessons');
    //
    // }

});

//Below moved to lesson route.
// router.get ('/lessons', function (request, response) {
//     // response.send ('This is the lesson page');
//     response.render ('lessons');
// });

router.get ('/bio', function (request, response) {
    response.render ('bio');
});

router.get ('/video', function (request, response) {
    response.render ('video');
});

router.get ('/performance', function (request, response) {
    response.render ('performance');
});
router.get ('/contact', function (request, response) {
    response.render ('contact');
});

//Be able to upload pictures here.
router.get ('/gallery', function (request, response) {
    response.render ('gallery');
});

//Create a route to handle the received uploaded file.
    //imageFile is from the gallery.hbs file.
router.post ('/gallery', processUploadFile.single ('imageFile'), function (request, response) {
    console.log ('File: ', request.file);
    console.log ('File: ', request.body);
    console.log ('File: ', request.file.path);

    var fs = require ('fs-extra');

    var source = request.file.path;
    //If we look in the terminal we see 'originalname' in the request.file.
    var destination = './public/images/upload/' + request.file.originalname;

    fs.move (source, destination, function (error) {

        //Delete the old temporary file.
        fs.remove (source, function (error) {
            response.redirect ('/gallery');
        });
    });
});
//---------------------------------------------
//Route to load the Angular UI Frontend.
router.get ('/admin', function (request, response) {
    // response.send ('-This is the admin page with angular');

    //Load the angular home partial.
    response.render ('home', {
        //Override the default index.hbs and use the index-angular.hbs
        layout: 'index-angular'
    });
});

//Export the module.
module.exports = router;
