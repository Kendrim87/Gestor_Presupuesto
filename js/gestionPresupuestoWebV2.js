import * as gestionPresupuesto from './gestionPresupuesto.js';

let divTotalGastos = document.getElementById('total-gastos');
let divFormularioGasto = document.getElementById('formulario-gasto');
let divListadoGastos = document.getElementById('listado-gastos');

class MiGasto extends HTMLElement {
    constructor() {
        super();
        this.gasto = null;
    }

    connectedCallback() {
        let shadow = this.attachShadow({ mode: 'open' });

        let plantilla = document.getElementById('template-gastos');
        let contenidoPlantilla = plantilla.content.cloneNode(true);
        shadow.appendChild(contenidoPlantilla);

        this.mostrarDatos();
        this.configurarEventos();
    }

    configurarEventos() {
        let shadow = this.shadowRoot;

        let botonBorrar = shadow.getElementById('boton-borrar');
        botonBorrar.addEventListener('click', this.borrarGasto.bind(this));

        let botonEditar = shadow.getElementById('boton-editar');
        botonEditar.addEventListener('click', this.mostrarFormularioEdicion.bind(this));

        let formularioEdicion = shadow.getElementById('formulario-edicion');
        formularioEdicion.addEventListener('submit', this.guardarCambios.bind(this));

        let botonCancelar = shadow.getElementById('boton-cancelar');
        botonCancelar.addEventListener('click', this.ocultarFormularioEdicion.bind(this));
    }

    borrarGasto() {
        if (confirm('¿Estás seguro de que quieres borrar este gasto?')) {
            gestionPresupuesto.borrarGasto(this.gasto.id);
            actualizarTotalGastos();
            mostrarListadoGastos();
        }
    }

    mostrarFormularioEdicion() {
        let shadow = this.shadowRoot;
        let formulario = shadow.getElementById('formulario-edicion');

        shadow.getElementById('editar-descripcion').value = this.gasto.descripcion;
        shadow.getElementById('editar-valor').value = this.gasto.valor;
        shadow.getElementById('editar-fecha').value = this.gasto.obtenerPeriodoAgrupacion('dia');
        shadow.getElementById('editar-etiquetas').value = this.gasto.etiquetas.join(', ');

        formulario.hidden = false;
    }

    ocultarFormularioEdicion() {
        let shadow = this.shadowRoot;
        let formulario = shadow.getElementById('formulario-edicion');
        formulario.hidden = true;
    }

    guardarCambios(evento) {
        evento.preventDefault();

        let shadow = this.shadowRoot;

        let nuevaDescripcion = shadow.getElementById('editar-descripcion').value;
        let nuevoValor = parseFloat(shadow.getElementById('editar-valor').value);
        let nuevaFecha = shadow.getElementById('editar-fecha').value;
        let nuevasEtiquetasTexto = shadow.getElementById('editar-etiquetas').value;

        this.gasto.actualizarDescripcion(nuevaDescripcion);
        this.gasto.actualizarValor(nuevoValor);
        this.gasto.actualizarFecha(nuevaFecha);

        this.gasto.etiquetas = [];
        let etiquetasArray = nuevasEtiquetasTexto.split(',').map(function (etiqueta) {
            return etiqueta.trim();
        });
        this.gasto.anyadirEtiquetas(...etiquetasArray);

        this.mostrarDatos();
        this.ocultarFormularioEdicion();
        actualizarTotalGastos();
    }

    mostrarDatos() {
        if (this.gasto) {
            let shadow = this.shadowRoot;

            let divDescripcion = shadow.getElementById('descripcion-gasto');
            divDescripcion.textContent = 'Descripción: ' + this.gasto.descripcion;

            let divValor = shadow.getElementById('valor-gasto');
            divValor.textContent = 'Importe: ' + this.gasto.valor.toFixed(2) + ' €';

            let divFecha = shadow.getElementById('fecha-gasto');
            let fecha = new Date(this.gasto.fecha);
            divFecha.textContent = 'Fecha: ' + fecha.toLocaleDateString();

            let divEtiquetas = shadow.getElementById('etiquetas-gasto');
            if (this.gasto.etiquetas.length > 0) {
                divEtiquetas.textContent = 'Etiquetas: ' + this.gasto.etiquetas.join(', ');
            } else {
                divEtiquetas.textContent = '';
            }
        }
    }
}

customElements.define('mi-gasto', MiGasto);

// Creamos el botón para guardar el listado actual en el almacenamiento local del navegador
let botonGuardarListado = document.createElement('button');
botonGuardarListado.type = 'button';
botonGuardarListado.id = 'guardar-listado';
botonGuardarListado.textContent = 'Guardar listado en localStorage';

// Creamos el botón para cargar un listado previamente guardado desde el almacenamiento local
let botonCargarListado = document.createElement('button');
botonCargarListado.type = 'button';
botonCargarListado.id = 'cargar-listado';
botonCargarListado.textContent = 'Cargar listado desde localStorage';

// Creamos un contenedor div para los botones y los insertamos en él
let cargar_guardar_botones = document.createElement('div');
cargar_guardar_botones.style.marginTop = '10px';
cargar_guardar_botones.append(botonGuardarListado, botonCargarListado);

// Insertamos el contenedor de botones justo después del formulario de gastos
// Usamos .after() para añadirlo al DOM sin modificar el archivo index.html
if (divFormularioGasto && divFormularioGasto.parentNode) {
    divFormularioGasto.after(cargar_guardar_botones);
}

// FUNCIÓN PARA GUARDAR EL LISTADO EN LOCALSTORAGE
// Esta función obtiene todos los gastos actuales y los guarda en formato JSON
function guardarListadoLocal() {
    // Obtenemos el listado actual de gastos usando la función de gestiónPresupuesto
    let gastos = gestionPresupuesto.listarGastos();
    
    // Creamos un array que contendrá los objetos en formato para JSON
    let gastosParaGuardar = [];
    
    // Recorremos cada gasto y creamos un objeto con sus propiedades
    for (let i = 0; i < gastos.length; i++) {
        let gastoActual = gastos[i];
        gastosParaGuardar.push({
            descripcion: gastoActual.descripcion,
            valor: gastoActual.valor,
            // Convertimos la fecha a formato ISO string para JSON
            fecha: new Date(gastoActual.fecha).toISOString(),
            etiquetas: gastoActual.etiquetas
        });
    }

    // Guardamos el array como string JSON en localStorage
    localStorage.setItem("lista_gastos_local", JSON.stringify(gastosParaGuardar));
}

// FUNCIÓN PARA CARGAR EL LISTADO DESDE LOCALSTORAGE
// Esta función recupera los gastos guardados y los reconstruye como objetos funcionales
function cargarListadoLocal() {
    // Leemos el contenido de la clave "lista_gastos_local" del almacenamiento local
    let datosGuardados = localStorage.getItem("lista_gastos_local");
    
    // Si no existe la clave, terminamos sin hacer nada
    if (!datosGuardados) return;

    // Convertimos el string JSON a un array de objetos
    let gastosRecuperados = JSON.parse(datosGuardados);

    // Delegamos la reconstrucción a la lógica de negocio
    // sobrescribirGastos vacía el listado, reinicia los ids y reconstruye los gastos como instancias de CrearGasto
    gestionPresupuesto.sobrescribirGastos(gastosRecuperados);

    // Actualizamos la interfaz: recalculamos el total y mostramos el listado
    actualizarTotalGastos();
    mostrarListadoGastos();
}

// Enlazamos los botones con sus funciones correspondientes usando event listeners
botonGuardarListado.addEventListener('click', guardarListadoLocal);
botonCargarListado.addEventListener('click', cargarListadoLocal);

function mostrarListadoGastos() {
    divListadoGastos.innerHTML = '';
    
    let gastos = gestionPresupuesto.listarGastos();
    
    for (let gasto of gastos) {
        let elementoGasto = document.createElement('mi-gasto');
        elementoGasto.gasto = gasto;
        divListadoGastos.appendChild(elementoGasto);
    }
}

function crearFormulario() {
    let formulario = document.createElement('form');
    formulario.id = 'form-nuevo-gasto';

    let labelDescripcion = document.createElement('label');
    labelDescripcion.textContent = 'Descripción: ';
    let inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.id = 'descripcion-gasto';

    let labelValor = document.createElement('label');
    labelValor.textContent = 'Valor: ';
    let inputValor = document.createElement('input');
    inputValor.type = 'number';
    inputValor.id = 'valor-gasto';
    inputValor.step = '0.01';

    let labelFecha = document.createElement('label');
    labelFecha.textContent = 'Fecha: ';
    let inputFecha = document.createElement('input');
    inputFecha.type = 'date';
    inputFecha.id = 'fecha-gasto';

    let labelEtiquetas = document.createElement('label');
    labelEtiquetas.textContent = 'Etiquetas (usa comas [ , ] para separar): ';
    let inputEtiquetas = document.createElement('input');
    inputEtiquetas.type = 'text';
    inputEtiquetas.id = 'etiquetas-gasto';

    let botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Añadir Gasto';

    formulario.append(labelDescripcion, inputDescripcion, document.createElement('br'));
    formulario.append(labelValor, inputValor, document.createElement('br'));
    formulario.append(labelFecha, inputFecha, document.createElement('br'));
    formulario.append(labelEtiquetas, inputEtiquetas, document.createElement('br'), document.createElement('br'));
    formulario.append(botonEnviar);

    divFormularioGasto.append(formulario);

    formulario.addEventListener('submit', manejadorForm);
}

function manejadorForm(evento) {
    evento.preventDefault();

    let descripcion = document.getElementById('descripcion-gasto').value;
    let valor = parseFloat(document.getElementById('valor-gasto').value);
    let fecha = document.getElementById('fecha-gasto').value;
    let etiquetasTexto = document.getElementById('etiquetas-gasto').value;

    let partes = etiquetasTexto.split(',');
    let etiquetas = [];
    for (let i = 0; i < partes.length; i++) {
        etiquetas.push(partes[i].trim());
    }

    gestionPresupuesto.anyadirGasto(new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas));

    evento.target.reset();

    actualizarTotalGastos();
    mostrarListadoGastos();
}

function actualizarTotalGastos() {
    let total = gestionPresupuesto.calcularTotalGastos();
    divTotalGastos.textContent = total.toFixed(2) + ' €';
}

gestionPresupuesto.anyadirGasto(new gestionPresupuesto.CrearGasto('Gasolina', 45.50, '2025-11-07', 'transporte', 'coche'));
gestionPresupuesto.anyadirGasto(new gestionPresupuesto.CrearGasto('Pizzería', 32, '2025-11-06', 'comida', 'ocio'));
gestionPresupuesto.anyadirGasto(new gestionPresupuesto.CrearGasto('Luz', 78.90, '2025-11-01', 'casa', 'energía'));

crearFormulario();
actualizarTotalGastos();
mostrarListadoGastos();
