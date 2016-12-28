//Load in the mongoose nodejs package.
var mongoose = require ('mongoose');

//Grab the schema object from mongoose.
var Schema = mongoose.Schema;

//Create a schema for the User.
var userSchema = new Schema ({
    username: String,
    password: String,
    email: String,
    type: String,
    createdOn: String,
    updatedOn: String,
    status: String
});

//Take the user schema object and create a user model object for
//working with the mongodb.
var User = mongoose.model ('User', userSchema);

//Make the user schema available to other modules.
module.exports = User;
