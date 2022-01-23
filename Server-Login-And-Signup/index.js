const express = require("express"); 
const bodyParser = require("body-parser") //helps parse body of request
const cors = require("cors"); 
const compression = require("compression"); //optimization? compresses response, so sends faster
const db = require("./db"); 
const app = express(); //creates express app

//middleware
app.use(cors())
app.use(compression())
app.use(bodyParser.json())

app.get("/", (req, res) => { 
    res.send("Hello World!")
})

app.post("/users", db.createUser); 
app.post("/login", db.login); 
app.listen(5000, () => {
    console.log("Server started on port 5000")
}); 

//EXPRESS APP SETUP ^ next step of flow is database