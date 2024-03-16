const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

const listaPokemon=[]
const limit=10;
let offset;

iniciarPrograma();

function iniciarPrograma(){
    offset=0;
    getPokemons(offset,limit)
}

function getPokemons(offset,limit){
    async function getPokemonsFetch(offset, limit) {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Error al obtener los Pokémon');
            }
    
            const data = await response.json();
            console.log(data)
            return data.results;
        } catch (error) {
            console.error('Error al obtener los Pokémon:', error);
            return [];
        }
    }
    
    
    const pokemonsurl = new Promise(async (resolve, reject) => {
        try {
            const pokemonData = await getPokemonsFetch(offset, limit);
            resolve(pokemonData);
        } catch (error) {
            reject(error);
        }
    });
    
    pokemonsurl
        .then(pokemonData => {
            pokemonData.forEach(pokemon => {
                getPokemonInfo(pokemon.url);
            });
        })
        .catch(error => {
            console.error('Error al obtener los Pokémon:', error);
        });
}




async function getPokemonInfo(url){
    try{
        const response=await fetch(url);
        if(!response.ok){
            throw new error('Hay un error al obtener la informacion')
        }
        const data=await response.json()
        
        const { name, sprites: { 'front_default': sprite } } = data;

        const ulListaPokemon=document.createElement('ul');
        const appDiv = document.getElementById('app');

        appDiv.appendChild(ulListaPokemon);
        ulListaPokemon.id='UlListaPokemon';

        mostrarPokemon(name, sprite);
    }
    catch(error){
        console.error(error)
    }
}

function mostrarPokemon(name, sprite) {
    const ul = document.getElementById('UlListaPokemon');
    const listItem = document.createElement('li');
    
    const imgElement = document.createElement('img');
    imgElement.src = sprite;
    imgElement.alt = name;

    const nameElement = document.createElement('p');
    nameElement.textContent = name;

    listItem.appendChild(imgElement);
    listItem.appendChild(nameElement);

    ul.appendChild(listItem);
}

searchBtn.addEventListener('click',()=>{
    const nombre=searchInput.value.toLowerCase();
    console.log(nombre)
    if (nombre !== '') {
        buscarPokemon(nombre);
    } else {
        alert('Por favor, ingresa un nombre de Pokémon válido.');
    }
})

nextBtn.addEventListener('click',()=>{
    offset+=10;

    const ul = document.getElementById('UlListaPokemon');
    ul.innerHTML = ''; // Limpiamos la lista antes de agregar el Pokémon encontrado

    getPokemons(offset,limit);
})

prevBtn.addEventListener('click',()=>{
    offset-=10;

    const ul = document.getElementById('UlListaPokemon');
    ul.innerHTML = ''; // Limpiamos la lista antes de agregar el Pokémon encontrado

    getPokemons(offset,limit);
})

resetBtn.addEventListener('click',()=>{
    const ul = document.getElementById('UlListaPokemon');
    ul.innerHTML = ''; // Limpiamos la lista antes de agregar el Pokémon encontrado
    iniciarPrograma();
})

function buscarPokemon(nombre) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
    
    getPokemonsByUrl(url)
        .then(pokemonData => {
            if (pokemonData) {
                const ul = document.getElementById('UlListaPokemon');
                ul.innerHTML = ''; // Limpiamos la lista antes de agregar el Pokémon encontrado
                const { name, sprites: { front_default: sprite } } = pokemonData;
                mostrarPokemon(name, sprite);
            } else {
                alert('El Pokémon no fue encontrado.');
            }
        })
        .catch(error => {
            console.error('Error al buscar el Pokémon:', error);
            alert('Hubo un error al buscar el Pokémon.');
        });
}

async function getPokemonsByUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener el Pokémon');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener el Pokémon:', error);
        return null;
    }
}