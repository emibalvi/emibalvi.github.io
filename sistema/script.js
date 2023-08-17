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
                <button class="btn btn-danger btn-eliminar">Eliminar Alumno</button>
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

class Materia {
    constructor({ nombre, fechaInicio, diasCursada }) {
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.diasCursada = diasCursada;
    }

    descripcionHTML() {
        return `<div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${this.nombre}</h5>
                <p class="card-text">Fecha de inicio: ${this.fechaInicio}</p>
                <p class="card-text">Días de cursada: ${this.diasCursada.join(', ')}</p>
            </div>
        </div>`;
    }
}

class ControladorMaterias {
    constructor() {
        this.listaMaterias = [];
        this.levantarMaterias();
    }

    agregarMateria(materia) {
        this.listaMaterias.push(materia);
    }

    mostrarMaterias(contenedor) {
        contenedor.innerHTML = '';

        this.listaMaterias.forEach((materia) => {
            contenedor.innerHTML += materia.descripcionHTML();
        });
    }

    levantarMaterias() {
        return fetch('materias.json')
            .then((response) => response.json())
            .then((data) => {
                this.listaMaterias = data.map((materia) => new Materia(materia));
            });
    }
}


const controladorAlumnos = new ControladorAlumnos();
const controladorMaterias = new ControladorMaterias();

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html")) {
        // Parte 1: Código específico para index.html
        const btnAgregar = document.getElementById('btnAgregar');
        const nombreInput = document.getElementById('nombre');
        const notasInput = document.getElementById('notas');
        const errorContainer = document.getElementById('errorContainer');
        const contenedorAlumnos = document.getElementById('contenedor_alumnos');
        const contenedorAlumnosModal = document.getElementById('contenedor_alumnos_modal');
        const btnMostrarAlumnos = document.getElementById('btnMostrarAlumnos');
        const btnAprobadosModal = document.getElementById('btnAprobadosModal');
        const btnDesaprobadosModal = document.getElementById('btnDesaprobadosModal');
        const btnTodosModal = document.getElementById('btnTodosModal');
        const inputBuscar = document.getElementById('inputBuscar');
        const btnBuscar = document.getElementById('btnBuscar');

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

        btnBuscar.addEventListener('click', () => {
            const busqueda = inputBuscar.value.trim();
            if (busqueda) {
                const alumnosEncontrados = controladorAlumnos.buscarAlumnosPorNombre(busqueda);
                controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, alumnosEncontrados);
            }
        });

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

                // Mostrar SweetAlert de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Alumno agregado',
                    text: 'El alumno se ha agregado correctamente.',
                    showConfirmButton: false,
                    timer: 1200
                });
            } else {
                // Mostrar SweetAlert de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor ingrese un nombre válido y notas válidas (0-10) separadas por comas.',
                    confirmButtonText: 'Cerrar'
                });
            }
        });

        btnMostrarAlumnos.addEventListener('click', () => {
            controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
        });

        btnAprobadosModal.addEventListener('click', () => {
            const aprobados = controladorAlumnos.listaAlumnos.filter(alumno => alumno.calcularPromedio() >= 7);
            controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, aprobados);
        });

        btnDesaprobadosModal.addEventListener('click', () => {
            const desaprobados = controladorAlumnos.listaAlumnos.filter(alumno => alumno.calcularPromedio() < 7);
            controladorAlumnos.mostrarAlumnos(contenedorAlumnosModal, desaprobados);
        });

        btnTodosModal.addEventListener('click', () => {
            controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
        });

        contenedorAlumnosModal.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-eliminar')) {
                const tarjeta = event.target.closest('.card');
                if (tarjeta) {
                    const indice = Array.from(contenedorAlumnosModal.children).indexOf(tarjeta);
                    if (indice !== -1) {
                        controladorAlumnos.eliminarAlumno(indice);
                        controladorAlumnos.mostrarAlumnosModal(contenedorAlumnosModal, controladorAlumnos.listaAlumnos);
                        controladorAlumnos.guardarEnStorage();

                        // Mostrar SweetAlert de éxito
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
    } else if (currentPage.includes("materias.html")) {
        // Parte 2: Código específico para materias.html
        const contenedorMaterias = document.getElementById('contenedor_materias');
        controladorMaterias.levantarMaterias()
            .then(() => {
                const materias = controladorMaterias.listaMaterias;
                mostrarMateriasEnTabla(contenedorMaterias, materias);
            });
    } else if (currentPage.includes("alumnos.html")) {
        // Parte 3: Código específico para alumnos.html
        const contenedorAlumnos = document.getElementById('contenedor_alumnos');
        controladorAlumnos.levantarStorage();
        mostrarAlumnosEnTabla(contenedorAlumnos, controladorAlumnos.listaAlumnos);
    }

    // ... (funciones auxiliares y cierre del evento DOMContentLoaded)

    function mostrarMateriasEnTabla(contenedor, materias) {
        contenedor.innerHTML = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Materia</th>
                        <th scope="col">Fecha de Inicio</th>
                        <th scope="col">Días de Cursada</th>
                    </tr>
                </thead>
                <tbody>
                    ${materias.map(materia => `
                        <tr>
                            <th scope="row">${materia.nombre}</th>
                            <td>${materia.fechaInicio}</td>
                            <td>${materia.diasCursada.join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function mostrarAlumnosEnTabla(contenedor, alumnos) {
        contenedor.innerHTML = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Alumno</th>
                        <th scope="col">Notas</th>
                        <th scope="col">Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    ${alumnos.map(alumno => `
                        <tr>
                            <th scope="row">${alumno.nombre}</th>
                            <td>${alumno.notas.join(', ')}</td>
                            <td>${alumno.calcularPromedio().toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }
});
