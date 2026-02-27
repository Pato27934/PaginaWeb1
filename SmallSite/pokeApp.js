console.log("Inicio del Javascript")
fetchPokes(25, 1);

//Divs
const resultado = document.getElementById("pokemonResultado");
//Botones
const boton = document.getElementById("botonOnePoke");
const botonFecthAll = document.getElementById("botonPokes");
//Inputs
const pokeName = document.getElementById("pokeName")
const pokeNumber = document.getElementById("pokeNumber")

boton.addEventListener("click", async () => {
    resultado.innerHTML = "";
    const data = await fetchPoke(pokeName.value);
    if (data) renderPoke(data);
});

pokeName.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        resultado.innerHTML = "";
        const data = await fetchPoke(pokeName.value);
        if (data) renderPoke(data);
    }
});

botonFecthAll.addEventListener("click", ()=> {
    resultado.innerHTML = "";
    fetchPokes(25, pokeNumber.value);
});
pokeNumber.addEventListener("keydown", (event) => {
    resultado.innerHTML = "";
    if (event.key === "Enter") {
        fetchPokes(25, pokeNumber.value);
    }
});

async function fetchPokes(num, off) {
    var offset = off + 1
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + num + "&offset=" + (offset)*25);
    if (!respuesta.ok) {
        resultado.textContent = "Pokemon no encontrado"
        return;
    }
    const datos = await respuesta.json();

    //Manda promesas para llamar a los datos
    const promesas = datos.results.map(poke => fetchPoke(poke.name));
    const allData = await Promise.all(promesas)

    for (const i of allData) {
        if (i) {
            renderPoke(i);
        }
    }
}

async function fetchPoke (daName) {
    if (!daName) {
        resultado.textContent = "Ingrese un nombre"
        return;
    }
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + daName);
    if (!respuesta.ok) {
        resultado.textContent = "Pokemon no encontrado"
        return;
    }
    const datos = await respuesta.json();
    return datos
}

function renderPoke (daDatos) {
    var pokeBackSprite
    var pokeFrontSprite
    if (daDatos.sprites.back_female == null) {
        pokeBackSprite = daDatos.sprites.back_default
        pokeFrontSprite = daDatos.sprites.front_default
    } else {
        pokeBackSprite = daDatos.sprites.back_female
        pokeFrontSprite = daDatos.sprites.front_female
    }
    var pokeSprite = pokeBackSprite;
    
    let pokeTypes = daDatos.types
        .map(t=>`${t.type.name}`)
        .join(" - ")

    resultado.innerHTML += `
        <h2>${daDatos.name}</h2>
        <img src="${pokeSprite}">
        <h5>Tipos: ` + pokeTypes + `</h5>
        <h5>Weight: ${daDatos.weight}</h5>
        <h5>HP: ${daDatos.stats.find(s=>s.stat.name==="hp").base_stat}</h5>
        <h5>Attack: ${daDatos.stats.find(s=>s.stat.name==="attack").base_stat}</h5>
        <h5>Defense: ${daDatos.stats.find(s=>s.stat.name==="defense").base_stat}</h5>
        <h5>Special Attack: ${daDatos.stats.find(s=>s.stat.name==="special-attack").base_stat}</h5>
        <h5>Special Defense: ${daDatos.stats.find(s=>s.stat.name==="special-defense").base_stat}</h5>
        <h5>Speed: ${daDatos.stats.find(s=>s.stat.name==="speed").base_stat}</h5>
        `
    ;
}