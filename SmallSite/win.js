const params = new URLSearchParams(window.location.search)
const winner = params.get("winner")

const nameEl = document.getElementById("winnerName")
const imgEl = document.getElementById("winnerImg")

nameEl.textContent = winner.toUpperCase() + " GANÓ"

async function loadWinner(){

    const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + winner)
    const data = await res.json()

    imgEl.src = data.sprites.front_default

}

loadWinner()