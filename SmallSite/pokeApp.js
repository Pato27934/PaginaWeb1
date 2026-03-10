console.log("Inicio del Javascript")
let currentPage = 1
let currentType = ""
let typeList = []

//Divs
const resultado = document.getElementById("pokemonResultado");
//Botones
const boton = document.getElementById("botonOnePoke");
const botonLeft = document.getElementById("buttonLeftPage");
const botonRight = document.getElementById("buttonRightPage");
//Inputs
const pokeName = document.getElementById("pokeName")
const pageNumber = document.getElementById("pageNumber")
const typeSelect = document.getElementById("typeSelect")
//Labels
const labelPage = document.getElementById("labelPage")

fetchPokes(25, currentPage)
loadTypes();

boton.addEventListener("click", async () => {
    currentType = ""
    typeSelect.value = ""
    resultado.innerHTML = "";
    const data = await fetchPoke(pokeName.value);
    if (data) renderPoke(data);
});

pokeName.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        currentType = ""
        typeSelect.value = ""
        resultado.innerHTML = "";
        const data = await fetchPoke(pokeName.value);
        if (data) renderPoke(data);
    }
});

typeSelect.addEventListener("change", async () => {
    currentPage = 1
    currentType = typeSelect.value
    resultado.innerHTML = ""

    if (currentType === "") {
        typeList = []
        fetchPokes(25, currentPage)
    } else {
        await fetchByType(currentType)
    }
});

//Navegador Inferior
botonLeft.addEventListener("click", async () => {
    currentPage -= 1
    if (currentPage <= 0) currentPage = 1
    pageNumber.value = ""
    resultado.innerHTML = ""

    if (currentType) {
        renderTypePage()
    } else {
        fetchPokes(25, currentPage)
    }
});

botonRight.addEventListener("click", async () => {
    currentPage += 1
    pageNumber.value = ""
    resultado.innerHTML = ""

    if (currentType) {
        renderTypePage()
    } else {
        fetchPokes(25, currentPage)
    }
});

pageNumber.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        currentPage = parseInt(pageNumber.value)
        pageNumber.value = ""
        resultado.innerHTML = ""

        if (currentType) {
            renderTypePage()
        } else {
            fetchPokes(25, currentPage)
        }
    }
});

async function fetchPokes(num, off) {
    labelPage.textContent = currentPage
    const page = Math.max(1, Number(off))
    const respuesta = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=" + num +
        "&offset=" + ((page - 1) * 25)
    )

    if (!respuesta.ok) {
        resultado.textContent = "Pokemon no encontrado"
        return
    }

    const datos = await respuesta.json()
    const promesas = datos.results.map(poke => fetchPoke(poke.name))
    const allData = await Promise.all(promesas)

    resultado.innerHTML = ""
    allData.forEach(p => {
        if (p) renderPoke(p)
    })
}

async function fetchByType(type) {
    labelPage.textContent = currentPage
    const respuesta = await fetch("https://pokeapi.co/api/v2/type/" + type)
    if (!respuesta.ok) return

    const datos = await respuesta.json()
    typeList = datos.pokemon.map(p => p.pokemon.name)
    renderTypePage()
}

function renderTypePage() {
    labelPage.textContent = currentPage
    resultado.innerHTML = ""

    const start = (currentPage - 1) * 25
    const end = start + 25
    const slice = typeList.slice(start, end)

    slice.forEach(async name => {
        const data = await fetchPoke(name)
        if (data) renderPoke(data)
    })
}

async function fetchPoke (daName) {
    if (!daName) {
        resultado.textContent = "Ingrese un nombre"
        return
    }

    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + daName)
    if (!respuesta.ok) {
        resultado.textContent = "Pokemon no encontrado"
        return
    }

    const datos = await respuesta.json()
    return datos
}

/* resultado.innerHTML += Shift + alt + A 
    <h2>${daDatos.name}</h2> 
    <img src="${pokeSprite}"> 
    <h5>Tipos: + pokeTypes + </h5> 
    <h5>Weight: ${daDatos.weight}</h5> 
    <h5>HP: ${daDatos.stats.find(s=>s.stat.name==="hp").base_stat}</h5> 
    <h5>Attack: ${daDatos.stats.find(s=>s.stat.name==="attack").base_stat}</h5> 
    <h5>Defense: ${daDatos.stats.find(s=>s.stat.name==="defense").base_stat}</h5> 
    <h5>Special Attack: ${daDatos.stats.find(s=>s.stat.name==="special-attack").base_stat}</h5> 
    <h5>Special Defense: ${daDatos.stats.find(s=>s.stat.name==="special-defense").base_stat}</h5> 
    <h5>Speed: ${daDatos.stats.find(s=>s.stat.name==="speed").base_stat}</h5> ; 
*/

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

    var pokeSprite = pokeFrontSprite
    
    let pokeTypes = daDatos.types
        .map(t=>`${t.type.name}`)
        .join(" - ")

    resultado.innerHTML += `
        <div class="poke-card">
            <h2>${daDatos.name}</h2>
            <img src="${pokeSprite}">
            <p>Tipos: ${pokeTypes}</p>
        </div>
    `
}
{/* <ul class="poke-stats">
<li>Weight: ${daDatos.weight}</li>
<li>HP: ${daDatos.stats.find(s=>s.stat.name==="hp").base_stat}</li>
<li>Attack: ${daDatos.stats.find(s=>s.stat.name==="attack").base_stat}</li>
<li>Defense: ${daDatos.stats.find(s=>s.stat.name==="defense").base_stat}</li>
<li>Sp. Atk: ${daDatos.stats.find(s=>s.stat.name==="special-attack").base_stat}</li>
<li>Sp. Def: ${daDatos.stats.find(s=>s.stat.name==="special-defense").base_stat}</li>
<li>Speed: ${daDatos.stats.find(s=>s.stat.name==="speed").base_stat}</li>
</ul> */}

async function loadTypes() {
    const types = await fetchTypes()

    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Todos"
    typeSelect.appendChild(defaultOption)

    types.forEach(type => {
        if (type.name !== "shadow" && type.name !== "unknown") {
            const option = document.createElement("option")
            option.value = type.name
            option.textContent = type.name
            typeSelect.appendChild(option)
        }
    })
}

async function fetchTypes() {
    const respuesta = await fetch("https://pokeapi.co/api/v2/type")

    if (!respuesta.ok) {
        console.log("Error al traer tipos")
        return []
    }

    const datos = await respuesta.json()
    return datos.results
}

async function cargarPelea(nombre1, nombre2) {

    const poke1 = await fetchPoke(nombre1)
    const poke2 = await fetchPoke(nombre2)

    document.getElementById("poke1Name").textContent = poke1.name
    document.getElementById("poke1Img").src = poke1.sprites.back_default

    document.getElementById("poke2Name").textContent = poke2.name
    document.getElementById("poke2Img").src = poke2.sprites.front_default
}