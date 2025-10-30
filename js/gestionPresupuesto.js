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

    actualizarFecha(nuevaFecha) {
        // Validamos que la fecha sea válida
        let timestamp = Date.parse(nuevaFecha);
        if (!isNaN(timestamp)) {
            this.fecha = timestamp;
        }
    }

    anyadirEtiquetas(...etiquetas) {
        // Recorremos las etiquetas y convertimos a String
        for (let i = 0; i < etiquetas.length; i++) {
            let etiquetaString = String(etiquetas[i]);

            // Añadimos si no existe
            if (!this.etiquetas.includes(etiquetaString)) {
                this.etiquetas.push(etiquetaString);
            }
        }
    }

    borrarEtiquetas(...etiquetas) {
        // Recorre el array y si la etiqueta existe, la elimina
        for (let i = 0; i < etiquetas.length; i++) {

            let etiquetaString = String(etiquetas[i]);
            let indice = this.etiquetas.indexOf(etiquetaString);

            if (indice >= 0) {
                this.etiquetas.splice(indice, 1);
            }
        }
    }

    mostrarGastoCompleto() {
        let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;
        let fechaFormateada = new Date(this.fecha).toLocaleString();
        texto += `Fecha: ${fechaFormateada}\n`;
        texto += `Etiquetas:\n`;

        for (let i = 0; i < this.etiquetas.length; i++) {
            texto += `- ${this.etiquetas[i]}\n`;
        }
        return texto;
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

function borrarGasto(id) {
    // Buscamos el gasto con el id proporcionado
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].id === id) {
            gastos.splice(i, 1);
            break;
        }
    }
}

function calcularTotalGastos() {
    // Recorremos el array de gastos y sumamos sus valores
    let total = 0;

    for (let i = 0; i < gastos.length; i++) {
        total += gastos[i].valor;
    }
    return total;
}

function calcularBalance() {
    // Devuelve el presupuesto menos los gastos
    let gastosTotales = calcularTotalGastos();
    return presupuesto - gastosTotales;
}

function filtrarGastos() {
    
}

function agruparGastos() {

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
    calcularBalance,
    filtrarGastos,
    agruparGastos
}
