//connect database 
require("dotenv").config(); 
const {emailValidation, passwordValidation} = require("./validation"); 
const bcrypt = require("bcryptjs")
const Pool = require("pg").Pool; 
const { user } = require("pg/lib/defaults");
const pool = new Pool({
    user: `${process.env.DB_USER}`, 
    password: `${process.env.DB_PASSWORD}`, 
    host: `${process.env.DB_HOST}`, 
    port: process.env.DB_PORT,
    database: `${process.env.DB_DATABASE}`
});

const createUser = async (request, response) => {
    try{
    const {username, email, password} = request.body;
    let errors = {}                     //maybe const?

    if (!emailValidation(email)){
        errors.email = "Email is not valid"; 
    }
    if (!passwordValidation(password)){
        errors.password = "Password is not valid"; 
    }

    const isEmailInUse = await pool.query(
        "SELECT * FROM users WHERE email = $1", 
        [email]
    );

    if (isEmailInUse.rows.length > 0){
        errors.email = "Email is already in use"
    }

    if (Object.keys(errors).length > 0){
        return response.status(400).json(errors); 
    }
    
    const salt = await bcrypt.genSalt(10);//salt encryption
    const hashedPassword = await bcrypt.hash(password, salt); //hash encryption

    const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", 
        [username, email, hashedPassword]
    )//what this does: hey so you got the username, email, and password, i want you to
    // run a query on the database so that it inserts this information using the sql in the quotes
    response.json({success: true, data: newUser.rows[0]}); 
}
catch (error){
    response.status(500).json({error: error.message})
}
}

const login = async (request, response) => {
    try {
        const {email, password} = request.body; 
        let errors = {}

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1", 
            [email]
        )

        if (user.rows.length === 0){
            response.status(400).json({ errors: "Email is not registered"});  
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password); 
        if(!isMatch){
            errors.password = "Password is incorrect"; 
        }
        if (Object.keys(errors).length > 0){
            return response.status(400).json(errors); 
        }
        response.json({success: true, data: user.rows[0] });
    }catch(error) {
        response.status[500].json({error: error.message}); 
    }
}

module.exports = {createUser, login}