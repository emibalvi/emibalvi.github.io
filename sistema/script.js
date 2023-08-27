class Alumno {
    constructor({ nombre, notas }) {
        this.nombre = nombre;
        this.notas = notas;
    }

    // Método para calcular el promedio
    calcularPromedio() {
        if (this.notas.length === 0) {
            return 0;
        }
        const sumaNotas = this.notas.reduce((suma, nota) => suma + nota, 0);
        return sumaNotas / this.notas.length;
    }

    // Método para generar la descripción HTML de un alumno
    descripcionHTML() {
        return `<div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${this.nombre}</h5>
                <p class="card-text">Notas: ${this.notas.join(', ')}</p>
                <p class="card-text">Promedio: ${this.calcularPromedio().toFixed(2)}</p>
                <button class="btn btn-primary btn-eliminar">Eliminar Alumno</button>
                <button class="btn btn-danger btn-editar">Editar Alumno</button>
            </div>
        </div>`;
    }

    // Método para obtener el alumno en formato JSON
    toJSON() {
        return {
            nombre: this.nombre,
            notas: this.notas
        };
    }
}

class ControladorAlumnos {
    constructor() {
        this.listaAlumnos = [];
        this.levantarStorage();
    }

    // Agregar un alumno a la lista
    agregarAlumno(alumno) {
        this.listaAlumnos.push(alumno);
    }

    // Eliminar un alumno de la lista
    eliminarAlumno(indice) {
        this.listaAlumnos.splice(indice, 1);
    }

    // Mostrar la lista de alumnos en un contenedor
    mostrarAlumnos(contenedor, alumnos) {
        contenedor.innerHTML = '';

        alumnos.forEach((alumno) => {
            contenedor.innerHTML += alumno.descripcionHTML();
        });
    }

    // Mostrar la lista de alumnos
    mostrarAlumnosModal(contenedorModal, alumnos) {
        contenedorModal.innerHTML = '';

        alumnos.forEach((alumno) => {
            contenedorModal.innerHTML += alumno.descripcionHTML();
        });
    }

    // Buscar alumnos por nombre
    buscarAlumnosPorNombre(nombre) {
        const alumnosEncontrados = this.listaAlumnos.filter(alumno =>
            alumno.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        return alumnosEncontrados;
    }

    // Guardar la lista de alumnos en el almacenamiento local
    guardarEnStorage() {
        let listaAlumnosJSON = JSON.stringify(this.listaAlumnos.map(alumno => alumno.toJSON()));
        localStorage.setItem("listaAlumnos", listaAlumnosJSON);
    }

    // Cargar la lista de alumnos desde el storage
    levantarStorage() {
        const listaAlumnosJSON = localStorage.getItem("listaAlumnos");
        if (listaAlumnosJSON) {
            const listaAlumnosObj = JSON.parse(listaAlumnosJSON);
            this.listaAlumnos = listaAlumnosObj.map(alumno => new Alumno(alumno));
        }
    }
}

const controladorAlumnos = new ControladorAlumnos();


document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregar');
    const nombreInput = document.getElementById('nombre');
    const notasInput = document.getElementById('notas');
    const errorContainer = document.getElementById('errorContainer');
    const contenedorAlumnosModal = document.getElementById('contenedor_alumnos_modal');
    const btnMostrarAlumnos = document.getElementById('btnMostrarAlumnos');
    const btnAprobadosModal = document.getElementById('btnAprobadosModal');
    const btnDesaprobadosModal = document.getElementById('btnDesaprobadosModal');
    const btnTodosModal = document.getElementById('btnTodosModal');
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnMostrarMaterias = document.getElementById('btnMostrarMaterias');
    const contenedorMateriasModal = document.getElementById('contenedor_materias_modal');
    const btnMostrarClima = document.getElementById('btnMostrarClima');
    const modalInstructivo = new bootstrap.Modal(document.getElementById('modalInstructivo'));
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');

    // Abrir el instructivo al abrir la web
    modalInstructivo.show();

    inputBuscar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            btnBuscar.click();
            event.preventDefault();
        }
    });

    nombreInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            notasInput.focus();
            event.preventDefault();
        }
    });

    notasInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            btnAgregar.click();
            event.preventDefault();
        }
    });


    btnMostrarMaterias.addEventListener('click', async () => {
        try {
            // Cargar las materias desde el archivo materias.json
            const response = await fetch('materias.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de materias.');
            }

            listaMaterias = await response.json();

            // Mostrar las materias en el modal
            mostrarMaterias(contenedorMateriasModal, listaMaterias);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al cargar las materias.');
        }
    });

    // Mostrar las materias en el modal
    function mostrarMaterias(contenedor, materias) {
        contenedor.innerHTML = '';

        materias.forEach((materia) => {
            contenedor.innerHTML += `<div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${materia.nombre}</h5>
                <p class="card-text">Fecha de inicio: ${materia.fechaInicio}</p>
                <p class="card-text">Días de cursada: ${materia.diasCursada.join(', ')}</p>
            </div>
        </div>`;
        });
    }

    // Buscar alumnos por nombre
    btnBuscar.addEventListener('click', () => {
        const busqueda = inputBuscar.value.trim();
        if (busqueda) {
            const alumnosEncontrados = controladorAlumnos.buscarAlumnosPorNombre(busqueda);
            controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, alumnosEncontrados);
        }
    });

    // Agregar un nuevo alumno
    btnAgregar.addEventListener('click', () => {
        const nombre = nombreInput.value.trim();
        const notas = notasInput.value.split(',').map((nota) => parseFloat(nota.trim()));

        const notasValidas = notas.every((nota) => !isNaN(nota) && nota >= 0 && nota <= 10);

        if (nombre && notas.length > 0 && notasValidas) {
            const nuevoAlumno = new Alumno({ nombre, notas });
            controladorAlumnos.agregarAlumno(nuevoAlumno);

            nombreInput.value = '';
            notasInput.value = '';
            errorContainer.textContent = '';
            controladorAlumnos.guardarEnStorage();

            Swal.fire({
                icon: 'success',
                title: 'Alumno agregado',
                text: 'El alumno se ha agregado correctamente.',
                showConfirmButton: false,
                timer: 1200
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese un nombre válido y notas válidas (0-10) separadas por comas.',
                confirmButtonText: 'Cerrar'
            });
        }
    });

    // Mostrar la lista de alumnos
    btnMostrarAlumnos.addEventListener('click', () => {
        controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
    });

    // Filtrar aprobados
    btnAprobadosModal.addEventListener('click', () => {
        const aprobados = controladorAlumnos.listaAlumnos.filter(alumno => alumno.calcularPromedio() >= 7);
        controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, aprobados);
    });

    // Filtrar desaprobados
    btnDesaprobadosModal.addEventListener('click', () => {
        const desaprobados = controladorAlumnos.listaAlumnos.filter(alumno => alumno.calcularPromedio() < 7);
        controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, desaprobados);
    });

    // Mostrar todos los alumnos
    btnTodosModal.addEventListener('click', () => {
        controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
    });

    // Eliminar un alumno
    contenedorAlumnosModal.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
            const tarjeta = event.target.closest('.card');
            if (tarjeta) {
                const indice = Array.from(contenedorAlumnosModal.children).indexOf(tarjeta);
                if (indice !== -1) {
                    controladorAlumnos.eliminarAlumno(indice);
                    controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
                    controladorAlumnos.guardarEnStorage();

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'El alumno ha sido eliminado',
                        showConfirmButton: false,
                        timer: 1200
                    });
                }
            }
        }
    });
    // Editar un alumno
    
contenedorAlumnosModal.addEventListener('click', (event) => {
    
    if (event.target.classList.contains('btn-editar')) {
        const tarjeta = event.target.closest('.card');
        if (tarjeta) {
            const indice = Array.from(contenedorAlumnosModal.children).indexOf(tarjeta);
            if (indice !== -1) {
                const alumno = controladorAlumnos.listaAlumnos[indice];
                abrirModalEdicion(alumno, indice);
            }
        }
    }
});

// Abrir el modal de edición y cargar datos del alumno
function abrirModalEdicion(alumno, indice) {
    const modalEditarAlumno = new bootstrap.Modal(document.getElementById('modalEditarAlumno'));
    const nuevoNombreInput = document.getElementById('nuevoNombre');
    const nuevasNotasInput = document.getElementById('nuevasNotas');

    nuevoNombreInput.value = alumno.nombre;
    nuevasNotasInput.value = alumno.notas.join(', ');
    
    modalEditarAlumno.show();

    nuevoNombreInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            nuevasNotasInput.focus(); 
            event.preventDefault();
        }
    });

    nuevasNotasInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            guardarCambios();
            modalEditarAlumno.hide();
            event.preventDefault();
        }
    });

    btnGuardarCambios.addEventListener('click', () => {
        guardarCambios();
        
    });

    function guardarCambios() {
        const nuevoNombre = nuevoNombreInput.value.trim();
        const nuevasNotas = nuevasNotasInput.value.split(',').map((nota) => parseFloat(nota.trim()));
    
        const notasValidas = nuevasNotas.every((nota) => !isNaN(nota) && nota >= 0 && nota <= 10);
    
        if (nuevoNombre.trim() && nuevasNotas.length > 0 && notasValidas) {
            alumno.nombre = nuevoNombre.trim();
            alumno.notas = nuevasNotas;
            controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
            controladorAlumnos.guardarEnStorage();
    
            Swal.fire({
                icon: 'success',
                title: 'Alumno actualizado',
                text: 'Los datos del alumno se han actualizado correctamente.',
                showConfirmButton: false,
                timer: 1200
            });
    
            // Cerrar el modal solo si los datos son correctos
            modalEditarAlumno.hide();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese un nombre válido y notas válidas (0-10) separadas por comas.',
                confirmButtonText: 'Cerrar'
            });
            // No cerrar el modal en caso de error
        }
    }
}


    // Función para mostrar el modal de clima
    function mostrarModalClima() {
        obtenerClima();
        $('#modalClima').modal('show');
    }

    btnMostrarClima.addEventListener('click', mostrarModalClima);

    // Función para obtener datos del clima desde la API de OpenWeatherMap
    async function obtenerClima() {
        try {
            const apiKey = '3426a1e9f5af1c2facaf73ad6be4f75e';
            const ciudad = 'Buenos Aires'; 
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('No se pudo obtener los datos del clima.');
            }

            const datosClima = await response.json();
            mostrarClima(datosClima);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al obtener los datos del clima.');
        }
    }

    // Funcion para mostrar los datos del clima en el modal
    function mostrarClima(datosClima) {
        const contenedorClima = document.getElementById('contenedor_modal_clima');
        contenedorClima.innerHTML = '';
        const temperatura = Math.round(datosClima.main.temp);
        const descripcionEnIngles = datosClima.weather[0].description;
        const descripcionEnEspanol = mapearDescripcionEnEspanol(descripcionEnIngles);
        contenedorClima.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Clima en ${datosClima.name}</h5>
                <p class="card-text">Temperatura: ${temperatura}°C</p>
                <p class="card-text">Descripción: ${descripcionEnEspanol}</p>
            </div>
        </div>`;
    }

    // Función para mapear las descripciones en ingles a español
    function mapearDescripcionEnEspanol(descripcionEnIngles) {
        switch (descripcionEnIngles.toLowerCase()) {
            case 'clear sky':
                return 'Cielo despejado';
            case 'few clouds':
                return 'Algunas nubes';
            case 'scattered clouds':
                return 'Nubes dispersas';
            case 'broken clouds':
                return 'Nubes rotas';
            case 'shower rain':
                return 'Lluvia aislada';
            case 'rain':
                return 'Lluvia';
            case 'thunderstorm':
                return 'Tormenta eléctrica';
            case 'snow':
                return 'Nieve';
            case 'mist':
                return 'Niebla';
            case 'overcast clouds':
                return 'Cielo cubierto';
            default:
                return descripcionEnIngles;
        }
    }
});