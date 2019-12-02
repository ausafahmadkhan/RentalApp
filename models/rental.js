const mongoose = require('mongoose');
const { genreSchema } = require('../models/genre')
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
    customer : {
        type : new mongoose.Schema({

            //taking only necessary fields of customer
            name : {
                type : String,
                minlength : 5,
                maxlength : 15,
                trim : true,
                required : true
            },
            isGold : {
                type : Boolean,
                required : true
            },
            phoneNumber : {
                type : String,
                minlength : 10,
                maxlength : 10,
                required : true
            }
        }),
        required : true
    },
    movie : {
        type : new mongoose.Schema({
            title : {
                type : String,
                required : true,
                minlength : 5,
                maxlength : 15,
                trim : true
            },
            genre : {
                type : genreSchema
            },
            dailyRentalRate : {
                type : Number,
                required : true,
                min : 0,
                max : 255
            }
        }),
        required : true
    },
    dateOut : {
        type : Date,
        required : true,
        default : Date.now()
    }
})

const Rental = mongoose.model('rentals', rentalSchema);

function validateRental(rental)
{
    const schema = {
        customerId : Joi.objectId().required(),
        movieId :  Joi.objectId().required(),
        dateOut : Joi.date()
    }

    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
