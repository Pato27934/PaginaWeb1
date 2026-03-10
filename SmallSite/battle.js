let trainer = "¡ENTRENADOR PKMN ";

const typeMoves = {

    normal: ["Arañazo","Golpe Normal","Doble Golpe","Hiperrayo"],

    fire: ["Placaje","Ascuas","Lanzallamas","Llamarada"],
    water: ["Placaje","Pistola Agua","Surf","Hidrobomba"],
    grass: ["Placaje","Látigo Cepa","Hoja Afilada","Rayo Solar"],

    electric: ["Placaje","Impactrueno","Chispa","Trueno"],
    ice: ["Embestida","Nieve Polvo","Rayo Hielo","Ventisca"],

    fighting: ["Placaje","Golpe Karate","Puño Drenaje","A Bocajarro"],
    poison: ["Placaje","Picotazo Veneno","Bomba Lodo","Bomba Lodo X"],
    psychic: ["Placaje","Confusión","Psíquico","Premonición"],

    ground: ["Placaje","Disparo Lodo","Excavar","Terremoto"],
    flying: ["Picotazo","Ataque Ala","Tajo Aéreo","Huracán"],

    bug: ["Arañazo","Picadura","Tijera X","Megacuerno"],
    dark: ["Placaje","Mordisco","Triturar","Pulso Umbrío"],
    rock: ["Golpe","Lanzarrocas","Avalancha","Roca Afilada"],
    steel: ["Placaje","Garra Metal","Cabeza Hierro","Cañón Flash"],

    ghost: ["Embestida","Lengüetazo","Bola Sombra","Infortunio"],
    dragon: ["Embestida","Dragoaliento","Garra Dragón","Enfado"],
    fairy: ["Placaje","Viento Feérico","Brillo Mágico","Fuerza Lunar"]
    
    }

const typeChart = {

        normal: {
        rock:0.5, ghost:0, steel:0.5
        },
        
        fire: {
        fire:0.5, water:0.5, grass:2, ice:2, bug:2, rock:0.5, dragon:0.5, steel:2
        },
        
        water: {
        fire:2, water:0.5, grass:0.5, ground:2, rock:2, dragon:0.5
        },
        
        grass: {
        fire:0.5, water:2, grass:0.5, poison:0.5, ground:2, flying:0.5,
        bug:0.5, rock:2, dragon:0.5, steel:0.5
        },
        
        electric: {
        water:2, electric:0.5, grass:0.5, ground:0, flying:2, dragon:0.5
        },
        
        ice: {
        fire:0.5, water:0.5, grass:2, ground:2, flying:2, dragon:2, steel:0.5
        },
        
        fighting: {
        normal:2, ice:2, rock:2, dark:2, steel:2,
        poison:0.5, flying:0.5, psychic:0.5, bug:0.5, fairy:0.5, ghost:0
        },
        
        poison: {
        grass:2, fairy:2,
        poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0
        },
        
        ground: {
        fire:2, electric:2, poison:2, rock:2, steel:2,
        grass:0.5, bug:0.5, flying:0
        },
        
        flying: {
        grass:2, fighting:2, bug:2,
        electric:0.5, rock:0.5, steel:0.5
        },
        
        psychic: {
        fighting:2, poison:2,
        psychic:0.5, steel:0.5, dark:0
        },
        
        bug: {
        grass:2, psychic:2, dark:2,
        fire:0.5, fighting:0.5, poison:0.5, flying:0.5,
        ghost:0.5, steel:0.5, fairy:0.5
        },
        
        rock: {
        fire:2, ice:2, flying:2, bug:2,
        fighting:0.5, ground:0.5, steel:0.5
        },
        
        ghost: {
        psychic:2, ghost:2,
        dark:0.5, normal:0
        },
        
        dragon: {
        dragon:2, steel:0.5, fairy:0
        },
        
        dark: {
        psychic:2, ghost:2,
        fighting:0.5, dark:0.5, fairy:0.5
        },
        
        steel: {
        ice:2, rock:2, fairy:2,
        fire:0.5, water:0.5, electric:0.5, steel:0.5
        },
        
        fairy: {
        fighting:2, dragon:2, dark:2,
        fire:0.5, poison:0.5, steel:0.5
        }
        
    }
    
    const params = new URLSearchParams(window.location.search)
    const poke1 = params.get("p1")
    const poke2 = params.get("p2")
    
    document.addEventListener("DOMContentLoaded", () => {
        cargarPelea()
    })
    
    //Variables Globales
    let playerType = ""
    let enemyType = ""
    let playerStats = {}
    let enemyStats = {}

    let playerHp = 0
    let enemyHp = 0

    let playerCharge = 0
    let enemyCharge = 0
    let playerMaxHp = 0
    let enemyMaxHp = 0

    let pendingMessage = null
    
    async function fetchPoke(daName){
    
        if(!daName) return
    
        const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + daName)
    
        if(!respuesta.ok) return
    
        return await respuesta.json()
    }
    
    async function cargarPelea(){
    
        const data1 = await fetchPoke(poke1)
        const data2 = await fetchPoke(poke2)
    
        if(data1) renderPlayer(data1)
        if(data2) renderEnemy(data2)
    
        setMessage(trainer + "quiere luchar!")
        showTextMode()
    }
    
    function renderPlayer(data){

        const name = document.getElementById("poke1Name")
        const img = document.getElementById("poke1Img")
        const type = document.getElementById("poke1Type")
        const hpText = document.getElementById("poke1HpText")
        const hpBar = document.getElementById("poke1HpBar")
    
        playerType = data.types[0].type.name
    
        const types = data.types.map(t=>t.type.name).join(" - ")
    
        const hp = data.stats.find(s=>s.stat.name==="hp").base_stat
        playerStats = {
            attack: data.stats.find(s=>s.stat.name==="attack").base_stat,
            defense: data.stats.find(s=>s.stat.name==="defense").base_stat,
            spAttack: data.stats.find(s=>s.stat.name==="special-attack").base_stat,
            spDefense: data.stats.find(s=>s.stat.name==="special-defense").base_stat
            }
        playerHp = data.stats.find(s=>s.stat.name==="hp").base_stat
    
        name.textContent = data.name.toUpperCase()
        img.src = data.sprites.back_default
        type.textContent = types
        hpText.textContent = hp + " / " + hp
        hpBar.style.width = "100%"
        playerMaxHp = hp
    
    }

    function renderEnemy(data){

        const name = document.getElementById("poke2Name")
        const img = document.getElementById("poke2Img")
        const type = document.getElementById("poke2Type")
        const hpBar = document.getElementById("poke2HpBar")
    
        enemyType = data.types[0].type.name
    
        const types = data.types.map(t=>t.type.name).join(" - ")
    
        enemyStats = {
            attack: data.stats.find(s=>s.stat.name==="attack").base_stat,
            defense: data.stats.find(s=>s.stat.name==="defense").base_stat,
            spAttack: data.stats.find(s=>s.stat.name==="special-attack").base_stat,
            spDefense: data.stats.find(s=>s.stat.name==="special-defense").base_stat
            }
            
        enemyHp = data.stats.find(s=>s.stat.name==="hp").base_stat
    
        name.textContent = data.name.toUpperCase()
        img.src = data.sprites.front_default
        type.textContent = types
        hpBar.style.width = "100%"
        enemyMaxHp = enemyHp
    }
    
    //TEXTOS BOX
    const textBox = document.getElementById("battleText")
    const moveBox = document.getElementById("moveSelect")
    
    function showTextMode(){
        textBox.classList.remove("hidden")
        moveBox.classList.add("hidden")
    }
    
    function showMoveMode(jugador){
    
        moveBox.classList.remove("hidden")
        textBox.classList.add("hidden")
    
        if(jugador === "player") setMoves(playerType)
        if(jugador === "enemy") setMoves(enemyType)
    }
    
    //MOVIMIENTOS
    function setMoves(type){
    
        const moves = typeMoves[type] || typeMoves["normal"]
    
        moveButtons.forEach((btn,i)=>{
            btn.textContent = moves[i]
        })
    }

    //TIPOS
    function getEffectiveness(attackType, defenderTypes){

        let mult = 1
        
        defenderTypes.forEach(type => {
        
        if(typeChart[attackType]?.[type]){
        mult *= typeChart[attackType][type]
        }
        
        })
        
        return mult
        }
    
    
    //LOGICA DE BATALLA
    let battleState = "start"
    
    const nextBtn = document.getElementById("textNext")
    
    nextBtn.addEventListener("click", () => {
        if(pendingMessage){
            setMessage(pendingMessage)
            pendingMessage = null
            return
        }
    
        if(battleState === "start"){
            battleState = "playerTurn"
            if(checkChargeTurn()) return
            showMoveMode("player")
            return
        }
    
        if(battleState === "playerText"){
            battleState = "enemyTurn"
            if(checkChargeTurn()) return
            showMoveMode("enemy")
            return
        }
    
        if(battleState === "enemyText"){
            battleState = "playerTurn"
            if(checkChargeTurn()) return
            showMoveMode("player")
            return
        }
    
    })
    
    const moveButtons = document.querySelectorAll(".moveBtn")
    
    //Main Logica
    moveButtons.forEach((btn,i) => {

        btn.addEventListener("click", () => {
    
            if(battleState !== "playerTurn" && battleState !== "enemyTurn") return
    
            const moveName = btn.textContent
            showTextMode()
    
            let attacker
            let defender
            let atkStats
            let defStats
            let atkType
            let defType
    
            if(battleState === "playerTurn"){
                attacker = poke1
                defender = poke2
                atkStats = playerStats
                defStats = enemyStats
                atkType = playerType
                defType = enemyType
            }
            else{
                attacker = poke2
                defender = poke1
                atkStats = enemyStats
                defStats = playerStats
                atkType = enemyType
                defType = playerType
            }
    
            if(Math.random() < 0.10){
                setMessage(attacker.toUpperCase() + " falló el ataque!")
                battleState = battleState === "playerTurn" ? "playerText" : "enemyText"
                return
            }
    
            let multiplier = 1
            let damage = 0
    
            if(i === 0){
                multiplier = getEffectiveness("normal",[defType])
                damage = Math.floor((atkStats.attack / defStats.defense) * 10 * multiplier)
            }
    
            if(i === 1){
                multiplier = getEffectiveness(atkType,[defType])
                damage = Math.floor((atkStats.attack / defStats.defense) * 10 * multiplier)
            }
    
            if(i === 2){
                multiplier = getEffectiveness(atkType,[defType])
                damage = Math.floor((atkStats.spAttack / defStats.spDefense) * 10 * multiplier)
            }
    
            if(i === 3){
    
                if(battleState === "playerTurn" && playerCharge < 2){
                    playerCharge++
                    setMessage(attacker.toUpperCase() + " está cargando su habilidad!")
                    battleState = "playerText"
                    return
                }
    
                if(battleState === "enemyTurn" && enemyCharge < 2){
                    enemyCharge++
                    setMessage(attacker.toUpperCase() + " está cargando su habilidad!")
                    battleState = "enemyText"
                    return
                }
    
                multiplier = getEffectiveness(atkType,[defType])
                damage = Math.floor((atkStats.spAttack*3 / defStats.spDefense) * 10 * multiplier)
    
                if(battleState === "playerTurn") playerCharge = 0
                else enemyCharge = 0
            }
    
            if(battleState === "playerTurn"){
                enemyHp -= damage
                if(enemyHp < 0) enemyHp = 0
            }
            else{
                playerHp -= damage
                if(playerHp < 0) playerHp = 0
            }
    
            setMessage(attacker.toUpperCase() + " usa " + moveName + "!")
            if(enemyHp === 0 || playerHp === 0){

                const fainted = enemyHp === 0 ? defender : attacker === poke1 ? poke1 : poke2
                const winner = enemyHp === 0 ? attacker : defender
            
                pendingMessage = fainted.toUpperCase() + " se desmayó!"
            
                setTimeout(() => {
                    //window.location.href = "win.html?winner=" + winner
                }, 1500)
            
            } else { 
                let msg = defender.toUpperCase() + " recibe " + damage + " daño!"
        
                if(multiplier > 1 && i === 1) msg += " ¡Es efectivo!"
                if(multiplier > 1 && i === 2) msg += " ¡Es super efectivo!"
        
                pendingMessage = msg
        
                updateHpBars()
        
                battleState = battleState === "playerTurn" ? "playerText" : "enemyText"
            }
    
        })
    
    })
    //Revision cargar movimiento
    function checkChargeTurn(){

        if(battleState === "playerTurn" && playerCharge > 0){
    
            playerCharge++
    
            if(playerCharge < 3){
                showTextMode()
                setMessage(poke1.toUpperCase() + " está cargando su habilidad!")
                battleState = "playerText"
                return true
            }
    
            let multiplier = getEffectiveness(playerType,[enemyType])
            let damage = Math.floor((playerStats.spAttack*3 / enemyStats.spDefense) * 10 * multiplier)
    
            enemyHp -= damage
            if(enemyHp < 0) enemyHp = 0
    
            updateHpBars()
    
            setMessage(poke2.toUpperCase() + " recibe " + damage + " daño!")
            playerCharge = 0
            battleState = "playerText"
            return true
        }
    
        if(battleState === "enemyTurn" && enemyCharge > 0){
    
            enemyCharge++
    
            if(enemyCharge < 3){
                showTextMode()
                setMessage(poke2.toUpperCase() + " está cargando su habilidad!")
                battleState = "enemyText"
                return true
            }
    
            let multiplier = getEffectiveness(enemyType,[playerType])
            let damage = Math.floor((enemyStats.spAttack*3 / playerStats.spDefense) * 10 * multiplier)
    
            playerHp -= damage
            if(playerHp < 0) playerHp = 0
    
            updateHpBars()
    
            setMessage(poke1.toUpperCase() + " recibe " + damage + " daño!")
            enemyCharge = 0
            battleState = "enemyText"
            return true
        }
    
        return false
    }
    
    function setMessage(text){
        document.getElementById("battleMessage").textContent = text
    }

    //CALCULOS Daño
    function calcularDanio(attack, defense, multiplier=1){

        let base = attack / defense * 10
        return Math.floor(base * multiplier)
        
        }
    
    function fallo(){
        return Math.random() < 0.10
        }
    
    function aplicarDanio(target, amount){

        if(target === "enemy"){
        enemyHp -= amount
        if(enemyHp < 0) enemyHp = 0
        }
        
        else{
        playerHp -= amount
        if(playerHp < 0) playerHp = 0
        }
        
        }

    function updateHpBars(){

        const playerBar = document.getElementById("poke1HpBar")
        const enemyBar = document.getElementById("poke2HpBar")
        const playerText = document.getElementById("poke1HpText")

        const playerPercent = (playerHp / playerMaxHp) * 100
        const enemyPercent = (enemyHp / enemyMaxHp) * 100

        playerBar.style.width = playerPercent + "%"
        enemyBar.style.width = enemyPercent + "%"

        playerText.textContent = playerHp + " / " + playerMaxHp

    }