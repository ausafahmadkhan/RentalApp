const mongoose = require('mongoose');
const express = require('express');
const customerRouter = require('./router/customer_router');

const app = express();

mongoose.connect("mongodb://localhost:27017/playground",
                {
                    useNewUrlParser : true,
                    useUnifiedTopology : true
                },(err) => {
                    if (!err)
                        console.log(`Connected to mongodb successfully`);
                    else
                        console.log(`Could not establish connection due to ${err}`)
                })
        

app.use("/customer", customerRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));