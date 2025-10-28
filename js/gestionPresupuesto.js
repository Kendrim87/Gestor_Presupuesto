// TODO: Variables globales
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

// TODO: Funciones adicionales

function actualizarPresupuesto(valor) {
    // Comprobamos que valor es de tipo number, es >= 0 y no es NaN (que sería tipo number)
    if (typeof valor === 'number' && valor >= 0 && !isNaN(valor)) {
        presupuesto = valor;
        return presupuesto;
    } else {
        console.error('Error: El valor introducido no es válido. Debe ser un número que no sea negativo.');
        return -1;
    }
}

function mostrarPresupuesto() {
    // Muestra el presupuesto devuelto por la función actualizarPresupuesto
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

class CrearGasto {
    constructor(descripcion, valor, fecha, ...etiquetas) {
        // Convertimos la descripción a cadena
        this.descripcion = String(descripcion);
        
        // Validamos que el valor sea un número >= 0
        if (typeof valor === 'number' && valor >= 0 && !isNaN(valor)) {
            this.valor = valor;
        } else {
            this.valor = 0;
        }
        
        // Array vacío de etiquetas
        this.etiquetas = [];

        // Procesamos la fecha
        if (fecha && !isNaN(Date.parse(fecha))) {
            this.fecha = Date.parse(fecha);
        } else {
            this.fecha = Date.now();
        }
        
        // Añadimos las etiquetas al array
        for (let etiqueta of etiquetas) {
            this.anyadirEtiquetas(etiqueta);
        }
    }
    
    mostrarGasto() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    }
    
    actualizarDescripcion(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    }
    
    actualizarValor(nuevoValor) {
        // Solo actualizamos si el valor es válido
        if (typeof nuevoValor === 'number' && nuevoValor >= 0 && !isNaN(nuevoValor)) {
            this.valor = nuevoValor;
        }
    }
}

function listarGastos() {
    // Devuelve el listado de gastos
    return gastos;
}

function anyadirGasto(gasto) {
    // Asignamos el id al gasto
    gasto.id = idGasto;
    
    // Incrementamos el idGasto para el próximo gasto
    idGasto++;
    
    // Añadimos el gasto al array
    gastos.push(gasto);
}

function borrarGasto() {
}

function calcularTotalGastos() {
}

function calcularBalance() {
}


// Exportación de funciones
export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance
}
