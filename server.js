const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = 8000;
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]
const POKEDEX = require('./pokedex.json')
// console.log(POKEDEX.pokemon[1].name)
app.use(morgan('dev'));
app.use(validateBearerToken)


app.use((req, res, next)=> {
    //res.send('Hello World!');
    next();
})
app.get('/types',  handleGetTypes);
app.get('/pokemon', handleGetPokemon);
//console.log(process.env.API_TOKEN);


//Checking for the 3 Use Cases Valid, Invalid, No Auth
function validateBearerToken(req, res, next){
    const authToken = req.get(`Authorization`);
    const apiToken = process.env.API_TOKEN;
    if(!authToken || authToken.split(" ")[1] !== apiToken){
        return res.status(401).json({error: "Unauthorized Request"})
    }

    //console.log('validation');
    next();
 }


function handleGetTypes(req,res){
    res.json(validTypes);
}
function handleGetPokemon(req,res){
    let response = POKEDEX.pokemon;
    if(req.query.name){
        response = response.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());

        })
    }
    if(req.query.type){
        response = response.filter(pokemon => {
            return pokemon.type.includes(req.query.type);

        })
    }
    res.json(response)
}

  

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})