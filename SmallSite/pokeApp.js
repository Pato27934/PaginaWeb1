console.log("Inicio del Javascript")

const boton = document.getElementById("boton");
const resultado = document.getElementById("pokemonResultado");
const pokeName = document.getElementById("pokeName")

boton.addEventListener("click", async ()=> {

    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokeName.value);
    if (!respuesta.ok) {
        resultado.textContent = "Pokemon no encontrado"
        return;
    }
    const datos = await respuesta.json();

    var pokeBackSprite
    if (datos.sprites.back_female == null) {
        pokeBackSprite = datos.sprites.back_default
    } else {
        pokeBackSprite = datos.sprites.back_female
    }
    
    let pokeTypes = datos.types
        .map(t=>`${t.type.name}`)
        .join(" - ")

    resultado.innerHTML = `
        <h2>${datos.name}</h2>
        <img src="${pokeBackSprite}">
        <h5>Tipos: ` + pokeTypes + `</h5>
        <h5>Weight: ${datos.weight}</h5>
        <h5>HP: ${datos.stats.find(s=>s.stat.name==="hp").base_stat}</h5>
        <h5>Attack: ${datos.stats.find(s=>s.stat.name==="attack").base_stat}</h5>
        <h5>Defense: ${datos.stats.find(s=>s.stat.name==="defense").base_stat}</h5>
        <h5>Special Attack: ${datos.stats.find(s=>s.stat.name==="special-attack").base_stat}</h5>
        <h5>Special Defense: ${datos.stats.find(s=>s.stat.name==="special-defense").base_stat}</h5>
        <h5>Speed: ${datos.stats.find(s=>s.stat.name==="speed").base_stat}</h5>
        `
    ;
});