
//Lines 3-4 create the server
var express = require ('express');
var server = express ();

//load in when using bootstrap
    //telling express that we only want to serve out of the public folder.
server.use (express.static ('public'));

var bodyParser = require ('body-parser');

server.use (bodyParser.urlencoded ({ extended: true}));

server.use (bodyParser.json ());

// Load the method override so express can know what
// HTTP method other than GET & POST is being used.
var methodOverride = require ('method-override');

// Let express know that we are overriding the HTTP method
// and using the method sent in the form data.
server.use (methodOverride (function (request, response) {
    // Grab the request information and check to see
    // if the HTTP method was sent down as an _method value.

    // Check if the request has body content.
    if (request.body) {
        if (typeof request.body === 'object') {

            //Check if the body has an '_method' property on it.
            if (request.body._method) {

                // Grab the HTTP method from the body.
                var method = request.body._method;

                //Remove the _method property from the body.
                delete request.body._method;

                // Return the actual HTTP method.
                return method;
            }
        }
    }
}));

//Load in the express session handler.
var session = require ('express-session');

//Configure the session to be used by express.
server.use (session ({
    secret: 'This is my secret phrase.',
    resave: false,
    saveUninitialized: true
}));

//Load in the connect-flash express middleware module.
var flash = require ('connect-flash');

//set our server app to use the flash message object.
server.use (flash());

//Set a global function that will be run before any of our other routes are run.
server.use (function (request, response, next) {
    //Set the local data in the template to use the user session data.
    response.locals.user = request.session.user;

    //Set the flash object to be set and used before running any other routes or functions.
    response.locals.message = request.flash ();

    //Grab the content-type from the request.
    var contentType = request.headers ['content-type'];
    request.contentType = contentType;

    //Set our request object to use JSON if we detect a request for 'application/json'.
    if (contentType == 'application/json') {
        request.sendJson = true;
    }

    //Move on to the next route.
    next ();
});

//need to define the port for the server in server.listen.
var port = 3000;

//Configure the render engine handlebars (templating system).
var handlebars = require ('express-handlebars');
server.engine ('.hbs', handlebars ({
    layoutsDir: 'templates',
    defaultLayout: 'index',
    extname: '.hbs'
}));

//Set default directory for express to use for handlebar templates.
server.set ('views', __dirname + '/templates/partials');

//Set the render engine for our server.
server.set ('view engine', '.hbs');

//Bring in Mongodb client driver and connect to the database.
var mongoClient = require ('mongodb').MongoClient;

//Create a reference to the database.
global.db;

mongoClient.connect ('mongodb://localhost:27017/olivia_website_database', function (error, database) {
    if (error) {
        console.error ('***ERROR: Unable to connect to the mongo database.');
        console.error (error);
    }
    else {
        //Launch the server app
        server.listen (port, function (error) {
            if (error !== undefined) {
                console.error ('***ERROR: Unable to start the server.')
            }
            else {
                //Link to database reference.
                db = database;
                //No errors found the server is good to go.
                console.log ('The server has successfully started on port:' + port);
            }
        });
    }
});



//-----------------------------------
//Set url routes that the server can use.

//Import in the routes to use.
var basicRoutes = require ('./routes/basic.js');
//Set our server to use the imported routes.
server.use ('/', basicRoutes);

var lessonRoutes = require ('./routes/lesson.js');
server.use ('/lesson', lessonRoutes);

var userRoutes = require ('./routes/user.js');
server.use ('/user', userRoutes);

//Test server route: tests the database query to see if it works.
server.get ('/test', function (request, response) {
    // response.send ('This is the test.');
    db.collection ('users').findOne ({ username: 'olivia'}, {}, function (error, result) {
        console.log ('This is the result of the query: ', result);
    });

    response.send ('db test was run.');
});


//--------------------------------------
//Sandbox for Mongoose.

//Load in the mongoose nodejs package.
var mongoose = require ('mongoose');

//Connect mongoose to the mongo db server.
mongoose.connect ('mongodb://localhost:27017/olivia_website_database');

//Set the mongoose promise library to use.
mongoose.Promise = require ('bluebird');
