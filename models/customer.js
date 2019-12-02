const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            required : true,
            minlength : 4,
            maxlength : 20,
        },
        isGold :
        {
            type : Boolean,
            default : false
        },
        phoneNumber : 
        {
            type : String,
            required : true,
            minlength : 5,
            maxlength : 15
        }
        //and several other fields
    }
);

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer)
{
    const schema = {
        name : Joi.string().min(4).max(50).required(),
        phoneNumber : Joi.string().min(5).max(15).required(),
        isGold : Joi.boolean()
    }
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
