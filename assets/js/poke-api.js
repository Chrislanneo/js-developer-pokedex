//Saída desse arquivo vai ter um objeto em que haverá as funções de manipulação da pokeAPI

//objeto
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon

}

//requesição do detalhe, convertendo para json
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

//manipulação do fetch.Foi lá no servidor...
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    //...buscou a lista de pokemons...
    return fetch(url)
        //...converteu a lista para json...
        .then((response) => response.json())
        //...pegou a lista dentro do json(que são os pokemons)...
        .then((jsonBody) => jsonBody.results)
        //lista de pokemons. Os pokemons tem nos detalhes uma url especifica para cada um e será feita uma requisição para elas separaddamente
        //...rtansforma a lista de pokemons em uma lista de busca do detalhe
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        //...Requisições dos detalhes, esperando que essa lista seja resolvida
        .then((detailRequests) => Promise.all(detailRequests))
        //...lista pokemons
        .then((pokemonsDetails) => pokemonsDetails)
}


