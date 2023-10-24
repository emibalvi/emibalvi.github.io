function armarEquipos() {
    const jugadoresInputTier1 = document.getElementById("jugadoresTier1");
    const jugadoresInputTier2 = document.getElementById("jugadoresTier2");
    const jugadoresInputTier3 = document.getElementById("jugadoresTier3");

    const jugadoresTier1 = jugadoresInputTier1.value.split(",").map(jugador => jugador.trim());
    const jugadoresTier2 = jugadoresInputTier2.value.split(",").map(jugador => jugador.trim());
    const jugadoresTier3 = jugadoresInputTier3.value.split(",").map(jugador => jugador.trim());

    if (jugadoresTier1.length < 2 || jugadoresTier2.length < 2 || jugadoresTier3.length < 2) {
        alert("Cada tier debe tener al menos 2 jugadores.");
        return;
    }

    const equipoAzulList = document.getElementById("modalEquipoAzul");
    const equipoNaranjaList = document.getElementById("modalEquipoNaranja");

    equipoAzulList.innerHTML = ""; // Limpiar la lista
    equipoNaranjaList.innerHTML = "";

    let colorAzul = "primary"; // Color azul para los jugadores del equipo azul
    let colorNaranja = "warning"; // Color naranja para los jugadores del equipo naranja

    while (jugadoresTier1.length > 0 || jugadoresTier2.length > 0 || jugadoresTier3.length > 0) {
        if (jugadoresTier1.length > 0) {
            agregarJugadorALista(jugadoresTier1.shift(), "Tier 1", equipoAzulList, colorAzul);
            agregarJugadorALista(jugadoresTier1.shift(), "Tier 1", equipoNaranjaList, colorNaranja);
        }
        if (jugadoresTier2.length > 0) {
            agregarJugadorALista(jugadoresTier2.shift(), "Tier 2", equipoAzulList, colorAzul);
            agregarJugadorALista(jugadoresTier2.shift(), "Tier 2", equipoNaranjaList, colorNaranja);
        }
        if (jugadoresTier3.length > 0) {
            agregarJugadorALista(jugadoresTier3.shift(), "Tier 3", equipoAzulList, colorAzul);
            agregarJugadorALista(jugadoresTier3.shift(), "Tier 3", equipoNaranjaList, colorNaranja);
        }
    }

    // Mostrar el modal
    $('#equiposModal').modal('show');
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
