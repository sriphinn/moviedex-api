require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express()
const PORT = 8001;
const MOVIEDEX = require('./movies.json');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

// ROUTE
app.get('/movies', handleGetMovies);

// FUNCTIONS
function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unathorized Request'})
    }
    // move to next middleware
    next();
}

function handleGetMovies(req, res) {
    let response = MOVIEDEX;

    if(req.query.genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    if(req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    } 
    if(req.query.avg_vote) {
        response = response.filter(movie => 
            movie.avg_vote === Number(req.query.avg_vote)
        )
    }
    res.json(response)
}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});