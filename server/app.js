const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

// Cache object
const cache = {};

// request handling
app.get('/', async (req, res) => {
    //if req i= or t=
    const { i, t } = req.query;

    // Create a unique cache key based on the query
    const cacheKey = i ? `i:${i}` : `t:${t}`;

    // Check if data is in the cache
    if (cache[cacheKey]) {
        return res.json(cache[cacheKey]);
    }

    // If not in cache, try to fetch OMDb
    try {
        // reponse asigned to object from API call
        const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'b7e0f8dd',
            i,
            t,
        },
        });

        // checks for successful API call from OMDd {"Response":"True"}
        if (response.data.Response === 'True') {
            // Stores the data in cache object
            cache[cacheKey] = response.data;
            // returns API response if successful
            return res.json(response.data);
        } else {
            // returns an error with 'Error' value from OMDb {"Response":"False","Error":"Movie not found!"}
            return res.json({ error: response.data.Error });
        }
    } 
    // if/else fails -- return error
    catch (error) {
        return res.json({ error: 'Failed to fetch data from OMDb API' });
    }
});

module.exports = app;