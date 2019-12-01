const express = require('express');
const router = express.Router();
router.use(express.json())
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

    customer = await customer.save().select("-__v");
    
    res.status(200).send(customer);
})

router.get("/getCustomer/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id).select("-__v");
    
    if (!customer)
    {
        return res.status(404).send("No customer present with the given id");
    }

    return res.status(200).send(customer);
})

router.put("/updateCustomer/:id", async (req, res) => {

    const { error } = await validate(req.body);

    if (error)
        return res.status(400).send(`Invalid customer : ${error.details[0].message}`);

    const customer =  await Customer.findByIdAndUpdate(req.params.id, 
        {
            name : req.body.name,
            isGold : req.body.isGold,
            phoneNumber : req.body.phoneNumber
        },
        {
            new : true
        }
    );
    )
    .select("-__v");

    if (!customer)
        return res.status(404).send("No customer present with the given id");

    return res.status(200).send(customer);

})

router.delete("/deleteCustomer/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id).select("-__v");

    if (!customer)
        return res.status(404).send("No customer with the given id");

    return res.status(200).send(customer);
})

module.exports = router;
