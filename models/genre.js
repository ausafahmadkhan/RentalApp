const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            required : true,
            minlength : 4,
            maxlength : 10
        }
    }
)

const Genre = mongoose.model('genres', genreSchema);

function validateGenre(genre)
{
    const schema = {
        name : Joi.string().min(4).max(10).required()
    }

    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;