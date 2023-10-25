function armarEquipos() {
    const jugadoresInputTier1 = document.getElementById("jugadoresTier1");
    const jugadoresInputTier2 = document.getElementById("jugadoresTier2");
    const jugadoresInputTier3 = document.getElementById("jugadoresTier3");

    var jugadoresTier1 = jugadoresInputTier1.value.split(",").map(jugador => jugador.trim());
    var jugadoresTier2 = jugadoresInputTier2.value.split(",").map(jugador => jugador.trim());
    var jugadoresTier3 = jugadoresInputTier3.value.split(",").map(jugador => jugador.trim());

    numJugadores = jugadoresTier1.length + jugadoresTier2.length + jugadoresTier3.length;

    console.log("Cantidad de jugadores: " + numJugadores);

    if (numJugadores % 2 !== 0) {
        alert("La cantidad de jugadores debe ser par");
    } else {
        calcularEquipos();
    }

    function calcularEquipos() {
        //Primero les asigno el valor del tier a cada jugador - Tier 1: Puntaje 3, Tier 2: Puntaje 2, Tier 3: Puntaje 1
        for (let i = 0; i < jugadoresTier1.length; i++) {
            jugadoresTier1[i] = { nombre: jugadoresTier1[i], puntaje: 3, tier: "Tier 1" }
        }
        for (i = 0; i < jugadoresTier2.length; i++) {
            jugadoresTier2[i] = { nombre: jugadoresTier2[i], puntaje: 2, tier: "Tier 2"  }
        }
        for (i = 0; i < jugadoresTier3.length; i++) {
            jugadoresTier3[i] = { nombre: jugadoresTier3[i], puntaje: 1, tier: "Tier 3"  }
        }

        //Junto todos los jugadores en un único array

        var jugadores = jugadoresTier1.concat(jugadoresTier2, jugadoresTier3);
        console.log(jugadores)

        //Suma total de los skills de los jugadores
        const totalSkill = jugadores.reduce((accumulator, object) => {
            return accumulator + object.puntaje;
        }, 0);
        console.log("Total Skill: " + totalSkill)
        skillPromedioPorEquipo = totalSkill / 2;
        console.log("Total Skill por equipo: " + skillPromedioPorEquipo)
        skillPromedioPorJugador = totalSkill / numJugadores;
        console.log("Skill promedio por jugador: " + skillPromedioPorJugador)

        //Armo equipo 1
        i = 0;
        var promedioSkillEquipo1;
        var promedioSkillEquipo2;
        var equipo1 = [];
        var equipo2 = [];
        //Asigno un jugador de tier alto
        equipo1.push(jugadores.shift())
        equipo2.push(jugadores.shift())
        i++
        while (i < numJugadores / 2) {
            //Saco promedio de mi equipo y lo comparo al skillPromedioPorJugador
            //Si es mayor, saco tier bajo. Si es menor, saco tier alto
            //Turno Equipo 1
            const skillTotalDelEquipo1 = equipo1.reduce((accumulator, object) => {
                return accumulator + object.puntaje;
            }, 0);
            promedioSkillEquipo1 = skillTotalDelEquipo1 / equipo1.length;
            if (promedioSkillEquipo1 > skillPromedioPorJugador) {
                equipo1.push(jugadores.pop())
            } else {
                equipo1.push(jugadores.shift())
            }
            //Turno Equipo 2
            const skillTotalDelEquipo2 = equipo2.reduce((accumulator, object) => {
                return accumulator + object.puntaje;
            }, 0);
            promedioSkillEquipo2 = skillTotalDelEquipo2 / equipo2.length;
            if (promedioSkillEquipo2 > skillPromedioPorJugador) {
                equipo2.push(jugadores.pop())
            } else {
                equipo2.push(jugadores.shift())
            }
            i++

        }

        //Team 1
        console.log(equipo1)
        //Team 2 = lo que queda en el array de jugadores 
        console.log(equipo2)

        const equipoAzulList = document.getElementById("modalEquipoAzul");
        const equipoNaranjaList = document.getElementById("modalEquipoNaranja");

        equipoAzulList.innerHTML = ""; // Limpiar la lista
        equipoNaranjaList.innerHTML = "";

        let colorAzul = "primary"; // Color azul para los jugadores del equipo azul
        let colorNaranja = "warning"; // Color naranja para los jugadores del equipo naranja

        for (i = 0; i < equipo1.length; i++) {
            agregarJugadorALista(equipo1[i].nombre, equipo1[i].tier, equipoAzulList, colorAzul);
            agregarJugadorALista(equipo2[i].nombre, equipo2[i].tier, equipoNaranjaList, colorNaranja);
        }

        // Mostrar el modal
        $('#equiposModal').modal('show');

        return
    }

    
}

// Esta función muestra el toast
function mostrarToast() {
    const copiarToast = new bootstrap.Toast(document.getElementById('copiarToast'), {
        delay: 3000 // 3 segundos
    });

    copiarToast.show();
}

async function copiarEquipos() {
    const modalEquipoAzulList = document.getElementById("modalEquipoAzul");
    const modalEquipoNaranjaList = document.getElementById("modalEquipoNaranja");

    const equipoAzul = modalEquipoAzulList.innerText.trim();
    const equipoNaranja = modalEquipoNaranjaList.innerText.trim();

    // Eliminar los tiers (por ejemplo, "Tier 1", "Tier 2") del contenido
    const equipoAzulSinTiers = equipoAzul.replace(/Tier \d+/g, '').trim();
    const equipoNaranjaSinTiers = equipoNaranja.replace(/Tier \d+/g, '').trim();

    // Formatear el contenido con una función personalizada
    const equipoAzulFormateado = formatearEquipo(equipoAzulSinTiers);
    const equipoNaranjaFormateado = formatearEquipo(equipoNaranjaSinTiers);

    // Formatear el contenido
    const contenidoACopiar = `Equipo Azul: ${equipoAzulFormateado}\nEquipo Naranja: ${equipoNaranjaFormateado}`;

    try {
        // Copiar al portapapeles utilizando la API del portapapeles
        await navigator.clipboard.writeText(contenidoACopiar);
        mostrarToast(); // Llama a la función para mostrar el toast
    } catch (err) {
        alert("Ocurrió un error al copiar al portapapeles. Por favor, selecciona y copia el texto manualmente.");
    }
}

// Función para formatear la lista de jugadores
function formatearEquipo(equipo) {
    // Dividir el contenido por saltos de línea y eliminar espacios vacíos
    const jugadores = equipo.split(/\n/).filter(jugador => jugador.trim() !== '');

    // Unir la lista de jugadores con comas y espacios
    return jugadores.join(', ');
}


// Función para agregar un jugador a la lista con el estilo deseado y el tier
function agregarJugadorALista(nombreJugador, tier, lista, estilo) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", `list-group-item-${estilo}`, "d-flex", "justify-content-between", "align-items-center");
    listItem.textContent = nombreJugador;

    // Agregar el badge con el tier del jugador
    const badge = document.createElement("span");
    badge.classList.add("badge", `bg-primary`, "rounded-pill");
    badge.textContent = tier;

    listItem.appendChild(badge);

    lista.appendChild(listItem);
}
