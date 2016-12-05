//Load in the mongoose nodejs package.
var mongoose = require ('mongoose');

//Grabl the schema object from mongoose.
var Schema = mongoose.Schema;

//Create a schema for the Lesson.
var lessonSchema = new Schema ({
    firstName: String,
    lastName: String,
    email: String,
    tel: Number,
    type: String,
    length: Number,
    date: String,
    time: String,
    where: String
});

//Create the model object
var Lesson = mongoose.model ('Lesson', lessonSchema);

//Make the model object available to other NodeJs modules.
module.exports = Lesson;
