
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/ecommers")
    .then((e) => {

        console.log("DATABASE CONNECTED");

    });
