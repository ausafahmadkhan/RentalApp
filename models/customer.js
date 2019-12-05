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
            // match : /pattern/
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
        },
        address :
        {
            type : Array,
            validate : 
            {
                isAsync : true,
                validator :  function(address, callback) {
                    if (Array.isArray(address))
                    {
                        if (address.length === 0)
                            callback(false);

                        address.forEach(function(a)
                        {
                            if (typeof a !== 'string')
                            {
                                callback(false);
                            }
                            else
                            {
                                a = a.trim();
                                if (a === "")
                                {
                                    callback(false);
                                }
                            }
                        })
                        callback(true);
                    }
                    callback(false);
                },
                message : "Should have atleast one address and has to be a non-empty string."
            },
        }
        //and several other fields        
    })

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer)
{
    const schema = {
        name : Joi.string().min(4).max(50).required(),
        phoneNumber : Joi.string().min(5).max(15).required(),
        isGold : Joi.boolean(),
        address : Joi.array().required()
    }
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
