const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');

router.use(express.json());

router.get("/getMovies", [auth], async (req, res) => {
    const movies = await Movie.find()
    .select("-__v")
    .sort("datePublished");
    
    return res.status(200).send(movies);
})

router.post("/addMovie", async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(`Invalid Movie : ${error.details[0].message}`);

    const genre = await Genre.findById(req.body.genreId);

    if (!genre)
        return res.status(404).send(`Invalid genre Id`);

    let movie = new Movie(
        {
            title : req.body.title,
            genre : {
                _id : genre._id,
                name : genre.name
            },
            inStockNumber : req.body.inStockNumber,
            dailyRentalRate : req.body.dailyRentalRate
        }
    )

    movie = await movie.save();

    return res.status(200).send(movie);
})

router.get("/getMovie/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id).select("-__v");
    
    if (!movie)
    {
        return res.status(404).send("No movie present with the given id");
    }

    return res.status(200).send(movie);
})

router.put("/updateMovie/:id", async (req, res) => {

    const { error } = await validate(req.body);

    if (error)
        return res.status(400).send(`Invalid movie : ${error.details[0].message}`);

    const genre = await Genre.findById(req.body.genreId);

    if (!genre)
        return res.status(404).send(`Invalid Genre Id`);

    const movie =  await Movie.findByIdAndUpdate(req.params.id, 
        {
            title : req.body.title,
            genre : {
                _id : genre._id,
                name : genre.name
            },
            inStockNumber : req.body.inStockNumber,
            dailyRentalRate : req.body.dailyRentalRate
        },
        {
            new : true
        }
    );

    if (!movie)
        return res.status(404).send("No movie present with the given id");

    return res.status(200).send(movie);

})

router.delete("/deleteMovie/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id).select("-__v");

    if (!movie)
        return res.status(404).send("No movie with the given id");

    return res.status(200).send(movie);
})

module.exports = router;
