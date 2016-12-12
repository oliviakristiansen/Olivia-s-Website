//Pull in express to make use of the framework.
var express = require ('express');

//Grab the url router from express.
var router = express.Router ();

//Load in the Lesson schema object.
var Lesson = require ('../model/basic.js')

router.get ('/', function (request, response) {
    // response.send ('This is the home page');
    // console.log ('HOME PAGE');
    response.render ('home');
});

//This route recieves data from the lesson form.
router.post ('/lesson', function (request, response) {
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
    var emailBody = 'Thanks for requesting a lesson ' + request.body.firstName + '! She is super excited to teach you. She will review your information and will email you directly. Thanks!'

    //Create a new lesson from the data sent down by form or API post.
    var requestLesson = Lesson (request.body);
    console.log (request.body);

    requestLesson.save (function (error, result) {
        //Check for errors.
        if (error) {
            console.error ('***ERROR: Unable to save the lesson.');
            console.error (error);
        }
        else {

            var lesson = Lesson (request.body)

            //Link the lesson to the user that is currently logged in.
            var user = request.session.user;
            lesson.owner = user;

            //Send a confirmation email.
                //Load in the http request module.
            var httpRequest = require ('request');

            //Make a request to the Sendgrid API service.
            httpRequest.post (
                //Pass the configuration object with where to make the call.
                {
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
            )
            //.on is chained so you only need one ; at the end of all the .on calls.
            .on ('response', function (requestReply) {
                console.log ('request reply: ', requestReply.statusCode);
                console.log ('request reply: ');
                //.flash and .redirect should be paired together because you want the
                //flash message to show up when you redirect to the page.
                request.flash ('success', 'Lesson was requested.');
                response.redirect ('/lesson');

            })
            .on ('error', function () {
                response.error ('There was a problem sending the request email.');
            })
            ;
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
            // }
        }
    });
});

//Below moved to lesson route.
// router.get ('/lessons', function (request, response) {
//     // response.send ('This is the lesson page');
//     response.render ('lessons');
// });

router.get ('/bio', function (request, response) {
    response.render ('bio');
});

//Export the module.
module.exports = router;
