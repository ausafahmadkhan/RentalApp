const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const Fawn = require('fawn');

Fawn.init(mongoose);

router.use(express.json());

router.get("/getRentals", async (req, res) => {
    const rental = await Rental.find()
    .select("-__v")
    .sort("-dateOut");
    
    return res.status(200).send(rental);
})

router.post("/addRental", async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(`Invalid rental : ${error.details[0].message}`);

    const customer = await Customer.findById(req.body.customerId).select("name isGold phoneNumber _id");

    if (!customer)
        return res.status(400).send("No customer with the given id");

    const movie = await Movie.findById(req.body.movieId).select("title genre dailyRentalRate inStockNumber _id");

    if (!movie)
        return res.status(400).send("No movie present with the given id")

    if (movie.inStockNumber === 0)
        return res.status(400).send("Movie not in stock");

    let rental = new Rental({
        customer : {
            _id : customer._id,
            name : customer.name,
            isGold : customer.isGold,
            phoneNumber : customer.phoneNumber
        },
        movie : {
            _id : movie._id,
            title : movie.title,
            genre : movie.genre,
            dailyRentalRate : movie.dailyRentalRate
        },
        dateOut : req.body.dateOut
    })

    try 
    {
        new Fawn.Task()
        .save("rentals", rental)
        .update("movies",
            {
                _id : movie._id
            },
            {
                $inc : { inStockNumber : -1 } 
            }
        )
        .run();

        return res.status(200).send(rental);
    }
    catch(err)
    {
        return res.status(500).send("something went wrong");
    }
})

router.get("/getRental/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id).select("-__v");
    
    if (!rental)
    {
        return res.status(404).send("No rental present with the given id");
    }

    return res.status(200).send(rental);
})

module.exports = router;
