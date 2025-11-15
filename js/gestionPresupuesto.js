let presupuesto = 0;
let gastos = [];
let idGasto = 0;


function actualizarPresupuesto(valor) {
    if (typeof valor === 'number' && valor >= 0 && !isNaN(valor)) {
        presupuesto = valor;
        return presupuesto;
    } else {
        console.error('Error: El valor introducido no es válido. Debe ser un número que no sea negativo.');
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

class CrearGasto {
    constructor(descripcion, valor, fecha, ...etiquetas) {
        this.descripcion = String(descripcion);

        if (typeof valor === 'number' && valor >= 0 && !isNaN(valor)) {
            this.valor = valor;
        } else {
            this.valor = 0;
        }

        this.etiquetas = [];

        if (fecha && !isNaN(Date.parse(fecha))) {
            this.fecha = Date.parse(fecha);
        } else {
            this.fecha = Date.now();
        }

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
        if (typeof nuevoValor === 'number' && nuevoValor >= 0 && !isNaN(nuevoValor)) {
            this.valor = nuevoValor;
        }
    }

    actualizarFecha(nuevaFecha) {
        let timestamp = Date.parse(nuevaFecha);
        if (!isNaN(timestamp)) {
            this.fecha = timestamp;
        }
    }

    anyadirEtiquetas(...etiquetas) {
        for (let i = 0; i < etiquetas.length; i++) {
            let etiquetaString = String(etiquetas[i]);

            if (!this.etiquetas.includes(etiquetaString)) {
                this.etiquetas.push(etiquetaString);
            }
        }
    }

    borrarEtiquetas(...etiquetas) {
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

    obtenerPeriodoAgrupacion(periodo) {
        let fecha = new Date(this.fecha);
        let anyo = fecha.getFullYear();
        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let dia = ('0' + fecha.getDate()).slice(-2);

        if (periodo === 'dia') {
            return `${anyo}-${mes}-${dia}`;
        } else if (periodo === 'mes') {
            return `${anyo}-${mes}`;
        } else if (periodo === 'anyo') {
            return `${anyo}`;
        }
    }
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;

    idGasto++;

    gastos.push(gasto);
}

function borrarGasto(id) {
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].id === id) {
            gastos.splice(i, 1);
            break;
        }
    }
}

function calcularTotalGastos() {
    let total = 0;

    for (let i = 0; i < gastos.length; i++) {
        total += gastos[i].valor;
    }
    return total;
}

function calcularBalance() {
    let gastosTotales = calcularTotalGastos();
    return presupuesto - gastosTotales;
}

function filtrarGastos(filtros) {
    return gastos.filter(function (gasto) {
        if (filtros.fechaDesde) {
            let fechaDesde = Date.parse(filtros.fechaDesde);
            if (gasto.fecha < fechaDesde) {
                return false;
            }
        }

        if (filtros.fechaHasta) {
            let fechaHasta = Date.parse(filtros.fechaHasta);
            if (gasto.fecha > fechaHasta) {
                return false;
            }
        }

        if (filtros.valorMinimo !== undefined) {
            if (gasto.valor < filtros.valorMinimo) {
                return false;
            }
        }

        if (filtros.valorMaximo !== undefined) {
            if (gasto.valor > filtros.valorMaximo) {
                return false;
            }
        }

        if (filtros.descripcionContiene) {
            let descripcionGasto = gasto.descripcion.toLowerCase();
            let textoBuscado = String(filtros.descripcionContiene).toLowerCase();
            if (!descripcionGasto.includes(textoBuscado)) {
                return false;
            }
        }

        if (filtros.etiquetasTiene && filtros.etiquetasTiene.length > 0) {
            let etiquetasGasto = gasto.etiquetas.map(function (etiqueta) {
                return String(etiqueta).toLowerCase();
            });

            let etiquetasBuscadas = filtros.etiquetasTiene.map(function (etiqueta) {
                return String(etiqueta).toLowerCase();
            });

            let coincidencias = etiquetasBuscadas.filter(function (etiquetaBuscada) {
                return etiquetasGasto.includes(etiquetaBuscada);
            });

            if (coincidencias.length === 0) {
                return false;
            }
        }

        return true;
    });
}

function agruparGastos(periodo = "mes", etiquetas = [], fechaDesde, fechaHasta) {
    let periodosValidos = ["dia", "mes", "anyo"];
    if (!periodosValidos.includes(periodo)) {
        periodo = "mes";
    }

    let filtros = {};

    if (etiquetas && etiquetas.length > 0) {
        filtros.etiquetasTiene = etiquetas;
    }

    if (fechaDesde) {
        filtros.fechaDesde = fechaDesde;
    }

    if (fechaHasta) {
        filtros.fechaHasta = fechaHasta;
    } else {
        let ahora = new Date();
        let anyo = ahora.getFullYear();
        let mes = ('0' + (ahora.getMonth() + 1)).slice(-2);
        let dia = ('0' + ahora.getDate()).slice(-2);
        filtros.fechaHasta = `${anyo}-${mes}-${dia}`;
    }

    let gastosFiltrados = filtrarGastos(filtros);

    return gastosFiltrados.reduce(function(acc, gasto) {
        let periodoAgrupacion = gasto.obtenerPeriodoAgrupacion(periodo);
        
        if (acc[periodoAgrupacion] === undefined) {
            acc[periodoAgrupacion] = 0;
        }
        
        acc[periodoAgrupacion] += gasto.valor;
        
        return acc;
    }, {});
}

function sobrescribirGastos(nuevosGastos) {
    gastos = [];
    idGasto = 0;

    if (!nuevosGastos || nuevosGastos.length === 0) return;

    for (let i = 0; i < nuevosGastos.length; i++) {
        let datosGasto = nuevosGastos[i];
        anyadirGasto(new CrearGasto(datosGasto.descripcion, datosGasto.valor, datosGasto.fecha, ...datosGasto.etiquetas));
    }
}


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
    agruparGastos,
    sobrescribirGastos
}
