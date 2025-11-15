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

let botonGuardarListado = document.createElement('button');
botonGuardarListado.type = 'button';
botonGuardarListado.id = 'guardar-listado';
botonGuardarListado.textContent = 'Guardar listado en localStorage';

let botonCargarListado = document.createElement('button');
botonCargarListado.type = 'button';
botonCargarListado.id = 'cargar-listado';
botonCargarListado.textContent = 'Cargar listado desde localStorage';

let cargar_guardar_botones = document.createElement('div');
cargar_guardar_botones.style.marginTop = '10px';
cargar_guardar_botones.append(botonGuardarListado, botonCargarListado);

if (divFormularioGasto && divFormularioGasto.parentNode) {
    divFormularioGasto.after(cargar_guardar_botones);
}

function guardarListadoLocal() {
    let gastos = gestionPresupuesto.listarGastos();
    
    let gastosParaGuardar = [];
    
    for (let i = 0; i < gastos.length; i++) {
        let gastoActual = gastos[i];
        gastosParaGuardar.push({
            descripcion: gastoActual.descripcion,
            valor: gastoActual.valor,
            fecha: new Date(gastoActual.fecha).toISOString(),
            etiquetas: gastoActual.etiquetas
        });
    }

    localStorage.setItem("lista_gastos_local", JSON.stringify(gastosParaGuardar));
}

function cargarListadoLocal() {
    let datosGuardados = localStorage.getItem("lista_gastos_local");
    
    if (!datosGuardados) return;

    let gastosRecuperados = JSON.parse(datosGuardados);

    gestionPresupuesto.sobrescribirGastos(gastosRecuperados);

    actualizarTotalGastos();
    mostrarListadoGastos();
}

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
