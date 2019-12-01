const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre')

Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema(
    {
        title : 
        {
            type : String,
            required : true,
            minlength : 5,
            maxlength : 10,
            trim : true
        },
        genre : 
        {
            type :genreSchema,
            required : true
        },
        inStockNumber : 
        {
            type : Number,
            required : true,
            min : 5,
            max : 100
        },
        dailyRentalRate :
        {
            type : Number,
            required : true,
            min : 10,
            max : 50
        }

    }
)

const Movie = mongoose.model('movies', movieSchema);

function validateMovie(movie)
{
    const schema = {
        title : Joi.string().min(5).max(10).required(),
        genreId : Joi.objectId().required(),
        inStockNumber : Joi.number().min(5).max(100).required(),
        dailyRentalRate : Joi.number().min(10).max(50).required()
    }

    return Joi.validate(movie, movieSchema);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
