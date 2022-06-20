const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let dbUrl = "";
if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.MONGODB_URI;
}

if (process.env.NODE_ENV === "test") {
    dbUrl = process.env.MONGODB_TEST_URI;
}

if (process.env.NODE_ENV === "development") {
    dbUrl = process.env.MONGODB_DEV_URI;
}
if (!dbUrl) {
    console.log("Mongo url not set in env file");
    new Error("Mongo url not set in env file");
}

mongoose.connect(
    dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) => {
        if (error) {
            console.log(`Failed to connect using mongoose : ${error}`);
        } else {
            console.log(
                `Connected to the db server. (${process.env.NODE_ENV})`
            );
        }
    }
);
