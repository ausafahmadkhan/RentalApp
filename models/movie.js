const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema(
    {
        title : 
        {
            type : String,
            required : true,
            minlength : 5,
            maxlength : 255,
            trim : true
        },
        genre : 
        {
            type : genreSchema,
            required : true
        },
        inStockNumber : 
        {
            type : Number,
            required : true,
            min : 0,
            max : 255
        },
        dailyRentalRate :
        {
            type : Number,
            required : true,
            min : 0,
            max : 255
        },
        datePublished :
        {
            type : Date,
            default : Date.now(),
            required : true
        }

    }
)

const Movie = mongoose.model('movies', movieSchema);

function validateMovie(movie)
{
    const schema = {
        title : Joi.string().min(5).max(255).required(),
        genreId : Joi.objectId().required(),
        inStockNumber : Joi.number().min(0).max(255).required(),
        dailyRentalRate : Joi.number().min(0).max(255).required()
    }

    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
