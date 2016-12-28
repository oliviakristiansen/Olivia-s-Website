//Load in the mongoose nodejs package.
var mongoose = require ('mongoose');

//Grabl the schema object from mongoose.
var Schema = mongoose.Schema;

//Create a schema for the Lesson.
var lessonSchema = new Schema ({
    firstName: String,
    lastName: String,
    email: String,
    telephone: Number,
    type: String,
    length: Number,
    date: String,
    day: String,
    time: String,
    reoccurring: String,
    where: String,
    comments: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User'}
});

//Create the model object
var Lesson = mongoose.model ('Lesson', lessonSchema);

//Make the model object available to other NodeJs modules.
module.exports = Lesson;
