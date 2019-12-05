const mongoose = require('mongoose');
const Joi = require('joi');

const validGenres = ["Horror", "Sci-Fi", "Romedy", "Thriller", "Action"];

const genreSchema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            enum : validGenres,
            required : true
        }
    }
)

const Genre = mongoose.model('genres', genreSchema);

function validateGenre(genre)
{
    const schema = {
        name : Joi.string().only(validGenres).required()
    }

    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;