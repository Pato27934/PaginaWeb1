console.log("Inicio del Javascript")

const boton = document.getElementById("boton");
const resultado = document.getElementById("pokemonResultado");

boton.addEventListener("click", async ()=> {

    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const datos = await respuesta.json();

    resultado.innerHTML = `
        <h2>${datos.name}</h2>
        <img src="${datos.sprites.back_female}">
    `;
});