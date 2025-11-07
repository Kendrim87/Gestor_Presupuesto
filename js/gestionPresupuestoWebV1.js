// Importamos las funciones de gestionPresupuesto
import * as gestionPresupuesto from './gestionPresupuesto.js';

// Creamos variables asociadas a los div del DOM mediante id
let divTotalGastos = document.getElementById('total-gastos');
let divFormularioGasto = document.getElementById('formulario-gasto');
let divListadoGastos = document.getElementById('listado-gastos');

//Pruebas funciones
let gastoPrueba = new gestionPresupuesto.CrearGasto('Compra', 50, '2024-11-07', 'supermercado');
console.log('gastoPrueba:', gastoPrueba);
console.log('mostrarGasto:', gastoPrueba.mostrarGasto());
console.log('mostrarGastoCompleto:', gastoPrueba.mostrarGastoCompleto());
gestionPresupuesto.anyadirGasto(gastoPrueba);
console.log('listarGastos:', gestionPresupuesto.listarGastos());
console.log('calcularTotalGastos:', gestionPresupuesto.calcularTotalGastos());

//Creación del formulario para añadir gastos
function crearFormulario() {
    // Creamos el formulario
    let formulario = document.createElement('form');
    formulario.id = 'form-nuevo-gasto';
    // Campo descripción
    let labelDescripcion = document.createElement('label');
    labelDescripcion.textContent = 'Descripción: ';
    let inputDescripcion = document.createElement('input');
    inputDescripcion.type = 'text';
    inputDescripcion.id = 'descripcion-gasto';
    // Campo valor
    let labelValor = document.createElement('label');
    labelValor.textContent = 'Valor: ';
    let inputValor = document.createElement('input');
    inputValor.type = 'number';
    inputValor.id = 'valor-gasto';
    inputValor.step = '0.01';
    // Campo fecha
    let labelFecha = document.createElement('label');
    labelFecha.textContent = 'Fecha: ';
    let inputFecha = document.createElement('input');
    inputFecha.type = 'date';
    inputFecha.id = 'fecha-gasto';
    // Campo etiquetas
    let labelEtiquetas = document.createElement('label');
    labelEtiquetas.textContent = 'Etiquetas (usa comas [ , ] para separar): ';
    let inputEtiquetas = document.createElement('input');
    inputEtiquetas.type = 'text';
    inputEtiquetas.id = 'etiquetas-gasto';
    // Botón submit
    let botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Añadir Gasto';
    // Añadimos todos los elementos al formulario
    formulario.append(labelDescripcion, inputDescripcion, document.createElement('br'));
    formulario.append(labelValor, inputValor, document.createElement('br'));
    formulario.append(labelFecha, inputFecha, document.createElement('br'));
    formulario.append(labelEtiquetas, inputEtiquetas, document.createElement('br'), document.createElement('br'));
    formulario.append(botonEnviar);

    // Añadimos el formulario al div correspondiente
    divFormularioGasto.append(formulario);

    // Añadimos el manejador de eventos para el envío del formulario
    formulario.addEventListener('submit', manejadorForm);
}
/*
// Un segundo método para crear el formulario usando innerHTML
function crearFormulario() {
    let formulario = document.createElement('form');
    formulario.id = 'form-nuevo-gasto';
    formulario.innerHTML = `
        <label>Descripción: <input type="text" id="descripcion-gasto" required /></label><br>
        <label>Valor: <input type="number" id="valor-gasto" step="0.01" required /></label><br>
        <label>Fecha: <input type="date" id="fecha-gasto" required /></label><br>
        <label id="label-etiquetas">Etiquetas (usa comas [ , ] para separar): </label><input type="text" id="etiquetas-gasto" /></label><br><br>
        <button type="submit">Añadir Gasto</button>
    `;

    divFormularioGasto.append(formulario);
    formulario.addEventListener('submit', manejadorForm);
}
*/
// Función manejadora del envío del formulario
function manejadorForm(evento) {
    evento.preventDefault();
    // Al usar preventDefault no se envia el formulario automáticamente y no recarga la página
    let descripcion = document.getElementById('descripcion-gasto').value;
    // Convertimos el string a número decimal
    let valor = parseFloat(document.getElementById('valor-gasto').value);
    let fecha = document.getElementById('fecha-gasto').value;
    let etiquetasTexto = document.getElementById('etiquetas-gasto').value;
    // Convertimos las etiquetas en un array según comas y quitamos espacios en blanco
    let etiquetas = etiquetasTexto.split(',').map(function(etiqueta) {
        return etiqueta.trim();
    });

    gestionPresupuesto.anyadirGasto(new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas));

    console.log('Gasto añadido');
    console.log('Lista actualizada:', gestionPresupuesto.listarGastos());
    //Limpiamos el formulario
    evento.target.reset();
}

// Llamamos a la función para crear el formulario al cargar la página
crearFormulario();