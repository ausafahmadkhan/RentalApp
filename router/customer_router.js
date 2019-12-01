const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

router.use(express.json());

router.get("/getCustomers", async (req, res) => {
    const customers = await Customer.find()
    .select("-__v")
    .sort("name");
    return res.status(200).send(customers);
})

router.post("/addCustomer", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(`Invalid Customer : ${error.details[0].message}`);
    
        let customer = new Customer(
        {
            name : req.body.name,
            isGold : req.body.isGold,
            phoneNumber : req.body.phoneNumber
        }
    )

    customer = await customer.save();
    
    res.status(200).send(customer);
})

module.exports = router;
