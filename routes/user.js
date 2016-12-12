//Bring in express
var express = require ('express');

//Create an express router.
var router = express.Router ();

//Load the User schema object.
var User = require ('../model/user.js');
var Lesson = require ('../model/basic.js');

//Define routes.
router.get ('/login', function (request, response) {
    response.render ('user/login');
});

//Try and find user by form data.
router.post ('/login', function (request, response) {
    // response.send ('You posted in the login page!');
    // response.render ('login');
    // console.log ('This is the result', request.body);

    //User.findOne will find only one user. If you use User.find the 'else if' statement will
    //be invalid because User.find will find any array even if you put in wrong info.
    User.findOne (
        {
            username: request.body.username,
            password: request.body.password
        },

        function (error, result) {
            //Check for errors.
                //something wrong with the server.
            if (error) {
                console.error ('***ERROR: problem finding the user.');
                console.error (error);
            }
            else if (!result) {
                request.flash ('error', 'Your username or password is incorrect');
                response.redirect ('/user/login');
            }
            else {
                console.log ('This is the found user: ', result);

                request.session.user = {
                    username: result.username,
                    email: result.email
                },

                console.log ('This is the session data: ', request.session);
                response.redirect ('/user/profile');
        }
    });
        // console.log ('This is the result: ', result);
});

// router.post ('/user/reset', function () {
//     var oldPassword = document.getElementById ('oldPassword').value;
//     var newPassword = document.getElementById ('newPassword').value;
//     var confirmPassword = document.getElementById ('confirmPassword').value;
//     if (oldPassword == "" || newPassword == "" || confirmPassword == "") {
//         alert ('Please fill out all details.');
//     }
//     else if (oldPassword == newPassword) {
//         alert ('Old password and New password cannot be the same');
//     }
//     else if (newPassword != confirmPassword) {
//         alert ('Passwords do not match');
//     }
//     else {
//         response.redirect ('/user/login');
//     }
// });

router.get ('/help', function (request, response) {
    response.render ('user/help');
});

router.post ('/help', function (request, response) {

    var emailTitle = 'Password Reset';
    var emailBody = 'Here is your new password ' + 'cat';

    User.findOne (
        {
            email: request.body.email
        },

        function (error, result) {
            if (error) {
                console.error ('***ERROR: problem finding the email.');
                console.error (error);
            }
            else if (!result){
                request.flash ('error', 'Cannont find email.');
                response.redirect ('/user/help');
            }
            else {

                var httpRequest = require ('request');

                User.save (function (error, result) {
                    if (error) {
                        console.error ('***ERROR: Unable to save the new password.');
                        console.error (error)
                    }
                    else {
                        console.log ('Password was succesfully save to db: ', User);
                        httpRequest.post (
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
                                            to: request.body.email,
                                            subject: emailTitle
                                        }
                                    ],
                                    from: {
                                        email: 'no-reply@reset.com'
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
                        .on ('response', function (requestReply) {
                            console.log ('request reply: ', requestReply.statusCode);
                            console.log ('request reply: ');
                            request.flash ('success', 'An email has been sent with your new password. Please sign in.');
                            response.redirect ('/user/login');
                        })
                        .on ('error', function () {
                            response.error ('There was a problem sending the registration email.');
                        })
                        ;
                    }
                });
            }
        }
    )
});

router.get ('/register', function (request, response) {
    response.render ('user/register');
});

router.post ('/register', function (request, response) {
    // response.send ('New user');

    //Create the parts of the email.
    var toList = [
        {
            email: request.body.email
        },
        {
            email: 'olivialemmelin@gmail.com'
        }
    ]

    var emailTitle = 'Welcome to olivialemmelin.com';
    var emailBody = 'Thanks for registering ' + request.body.username + '! If you are interested in lessons, please visit the lesson page to request or just browse lesson times.';

    //create a user object from the User schema.
    var newUser = User (request.body);

    User.findOne ({ username: request.body.username, email: request.body.email}, function (error, result) {
        console.log ('***RESULT', result);
        if (error) {
            console.error ('***ERROR registering.');
            console.error (error);
        }
        else if (result) {
            console.log ('This username or email already exists. Please try registering again.');
            request.flash ('error', 'This username or email already exists. Please try registering again.');
            response.redirect ('/user/register');
        }

        else {
            newUser.save (function (error, result) {
                if (error) {
                    console.error ('***ERROR: Unable to save the user.');
                    console.error (error)
                }
                else {
                    console.log ('User was succesfully save to db: ', newUser);

                    //findOne will only return in terminal one user that is already in the database.
                        //I was having the problem of putting in non-user username and password and it would
                        //still go to the profile page. Now it will show the error message 'Unable to find the user'
                        //I had User.find first and it would return an empty array in the terminal
                        //because it was overwriting the callback function.
                        // User.findOne (
                        // {
                        //     username: request.body.username,
                        //     password: request.body.password
                        // },
                        //
                    //     function (error, foundUser) {
                    //         if (error) {
                    //             console.error ('***ERROR: Unable to find the user.');
                    //             console.error (error);
                    //         }
                    //         else {
                    //             console.log ('User found: ', foundUser);
                    //         }
                    //     }
                    // );

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
                                    email: 'no-reply@register.com'
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
                    .on ('response', function (requestReply) {
                        console.log ('request reply: ', requestReply.statusCode);
                        console.log ('request reply: ');
                        request.flash ('success', 'You have registered! Please sign in.');
                        response.redirect ('/user/login');
                    })
                    .on ('error', function () {
                        response.error ('There was a problem sending the registration email.');
                    })
                    ;
                }
            });
        }
    });


});

router.get ('/profile', function (request, response) {

    Lesson.find ({}, function (error, result) {
        // console.log ('profile', request.session);
        // response.send ('TESTING');
        if (error) {
            console.error ('***ERROR registering.');
            console.error (error);
        }
        else {
            console.log ('result: ', result);
            response.render ('user/profile', {
                data: {
                    user: request.session.user,
                    lesson: result
                }
            });
        }
    });
});


router.get ('/logout', function (request, response) {
    // response.send ('Logout page');
    request.session.destroy ();
    console.log ('Session logout: ', request.session);
    response.redirect ('/user/login');
});



module.exports = router;
