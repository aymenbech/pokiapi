const express = require('express');
const fetch = require('node-fetch'); // Or any other method for HTTP requests

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint to get all Pokémon data
app.get('/api/pokemon', async (req, res) => {
    try {
        // Fetch the list of Pokémon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20'); // You can adjust the limit
        const data = await response.json();

        // Fetch details for each Pokémon
        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            return {
                name: pokemonData.name,
                id: pokemonData.id,
                height: pokemonData.height,
                weight: pokemonData.weight,
                baseExperience: pokemonData.base_experience,
                types: pokemonData.types.map(type => type.type.name).join(', '),
                abilities: pokemonData.abilities.map(ability => ability.ability.name).join(', '),
                image: pokemonData.sprites.front_default,
            };
        });

        // Wait for all promises to resolve
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        res.json(pokemonDetails); // Send the data back to the front end
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
