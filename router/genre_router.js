const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre')

router.use(express.json());

router.get("/getGenres", async (req, res) => {
    const genres = await Genre.find()
    .select("-__v")
    .sort("name");
    
    return res.status(200).send(genres);
})

router.post("/addGenre", async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(`Invalid genre : ${error.details[0].message}`);

    let genre = new Genre(
        {
            name : req.body.name
        }
    )

    genre = await genre.save();

    return res.status(200).send(genre);
})

router.get("/getGenre/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id).select("-__v");
    
    if (!genre)
    {
        return res.status(404).send("No genre present with the given id");
    }

    return res.status(200).send(genre);
})

router.put("/updateGenre/:id", async (req, res) => {

    const { error } = await validate(req.body);

    if (error)
        return res.status(400).send(`Invalid genre : ${error.details[0].message}`);

    const genre =  await Genre.findByIdAndUpdate(req.params.id, 
        {
            name : req.body.name,
        },
        {
            new : true
        }
    );

    if (!genre)
        return res.status(404).send("No genre present with the given id");

    return res.status(200).send(genre);

})

router.delete("/deleteGenre/:id", async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id).select("-__v");

    if (!genre)
        return res.status(404).send("No genre with the given id");

    return res.status(200).send(genre);
})

module.exports = router;
