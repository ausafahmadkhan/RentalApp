const mongoose = require('mongoose');
const express = require('express');
const customerRouter = require('./router/customer_router');
const genreRouter = require('./router/genre_router');
const movieRouter = require('./router/movie_router');
const rentalRouter = require('./router/rental_router');
const userRouter = require('./router/user_router');
const config = require('config');
const app = express();

mongoose.connect("mongodb://localhost:27017/playground",
                {
                    useNewUrlParser : true,
                    useUnifiedTopology : true
                },)
                .then(() => console.log("Connected to db successfully"))
                .catch((err) => console.log(`Could not connect to db due to ${err}`));
        
if (!config.get('mySecretKey'))
{
    console.error("Jwt key not defined...exiting")
    process.exit(0);
}

app.use("/customer", customerRouter);
app.use("/genre", genreRouter);
app.use("/movie", movieRouter);
app.use("/rental", rentalRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));