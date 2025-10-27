// TODO: Variables globales
let presupuesto = 0;

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
    constructor(descripcion, valor) {
        // Convertimos la descripción a cadena
        this.descripcion = String(descripcion);
        
        // Validamos que el valor sea un número >= 0
        if (typeof valor === 'number' && valor >= 0 && !isNaN(valor)) {
            this.valor = valor;
        } else {
            this.valor = 0;
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

// Exportación de funciones
export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto
}
