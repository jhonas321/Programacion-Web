$(document).ready(function () {
    const userName = sessionStorage.getItem('user') || 'Nombre de Usuario';
    $('#nameAd').text(userName);

    $('#buscarPorFechaBtn').click(function(event) {
        event.preventDefault();
        const fechaSeleccionada = $('#fecha').val();
        const periodoSeleccionado = $('#periodo').val();
         
        if (new Date(fechaSeleccionada) <= new Date()) {
            alert("Ingrese una fecha válida.");
            return;
        }
        
        buscarAmbientesPorFecha(fechaSeleccionada, periodoSeleccionado);
    });

  
    $('#buscarPorFechaYCapacidadBtn').click(function(event) {
        event.preventDefault();
        const fechaSeleccionada = $('#fechaCapacidad').val();
        const periodoSeleccionado = $('#periodoCapacidad').val();
        const capacidadSeleccionada = $('#capacidad').val();

        if (new Date(fechaSeleccionada) <= new Date()) {
            alert("Ingrese una fecha válida.");
            return;
        }

        buscarAmbientesPorFechaYCapacidad(fechaSeleccionada, periodoSeleccionado, capacidadSeleccionada);
    });
});

function buscarAmbientesPorFecha(fecha, periodo) {
    $.ajax({
        url: `http://localhost:5000/ambiente/aulasDisponibles/${fecha}/${periodo}`,
        type: 'GET',
        success: function (ambientes) {
            mostrarAmbientes(ambientes, fecha, periodo, '#resultadosFecha');
        },
        error: function (error) {
            console.error("Error al obtener ambientes:", error);
            alert("Error al buscar ambientes.");
        }
    });
}

function buscarAmbientesPorFechaYCapacidad(fecha, periodo, capacidad) {
    $.ajax({
        url: `http://localhost:5000/ambiente/aulasDisponibles/${fecha}/${periodo}/${capacidad}`,
        type: 'GET',
        success: function (ambientes) {
            mostrarAmbientes(ambientes, fecha, periodo, '#resultadosFechaCapacidad');
        },
        error: function (error) {
            console.error("Error al obtener ambientes:", error);
            alert("Error al buscar ambientes.");
        }
    });
}

function mostrarAmbientes(ambientes, fecha, periodo, selector) {
    const contenedorResultados = $(selector);
    contenedorResultados.empty();

    if (ambientes.length === 0) {
        alert("No se encontraron resultados.");
        contenedorResultados.append("<p style='font-size: 1.2em; font-weight': bold'>No se encontraron ambientes disponibles para las opciones seleccionadas.</p>");
        return;
    }

    const tabla = $('<table>').addClass('table table-striped table-hover'); 
    const encabezado = `
        <thead>
            <tr>
                <th>Tipo de ambiente</th>
                <th>Número</th>
                <th>Capacidad</th>
                <th>Descripción</th>
                <th>Facilidades</th>
                <th>Acciones</th>
            </tr>
        </thead>
    `;
    tabla.append(encabezado);

    const cuerpoTabla = $('<tbody>');
    ambientes.forEach(function (ambiente) {
        const facilidades = ambiente.facilidades ? ambiente.facilidades.split(',').join(', ') : 'Sin facilidades';
        const filaAmbiente = `
            <tr>
                <td>${ambiente.nombre_tipo}</td>
                <td>${ambiente.numero}</td>
                <td>${ambiente.capacidad}</td>
                <td>${ambiente.descripcion || 'Sin descripción'}</td>
                <td>${facilidades}</td>
                <td>
                    <button class="btn  btn-reservar hover-color-change" data-id="${ambiente.id_ambiente}">Reservar</button>
                </td>
            </tr>
        `;
        cuerpoTabla.append(filaAmbiente);
    });
    tabla.append(cuerpoTabla);
    const tablaResponsiva = $('<div>').addClass('table-responsive').append(tabla);
    contenedorResultados.append(tablaResponsiva);

    $('.btn-reservar').click(function() {
        const idAmbiente = $(this).data('id');
        const idUsuario = sessionStorage.getItem('userId');
         
        console.log("idAmbiente: ", idAmbiente);
        console.log("idUsuario: ", idUsuario);
        console.log("periodo: ", periodo);
        console.log("fecha: ", fecha);
        realizarReserva(idUsuario, idAmbiente, periodo, fecha);
    });
}
function realizarReserva(idUsuario, idAmbiente, periodo, fecha) {
   
    verificarReservaExistente(idUsuario, idAmbiente, periodo, fecha, function(reservaExistente) {
        if (reservaExistente) {
            alert('La reserva ya fue enviada.');
        } else {
           
            verificarNumeroReservasDelDia(idUsuario, idAmbiente, fecha, function(numeroReservas) {
               
                if (numeroReservas >= 2) {
                    alert('Ya ha alcanzado el límite de reservas para este ambiente y fecha.');
                } else {
                    
                    enviarReserva(idUsuario, idAmbiente, periodo, fecha);
                }
            });
        }
    });
}

function verificarReservaExistente(idUsuario, idAmbiente, periodo, fecha, callback) {
    $.ajax({
        url: `http://localhost:5000/ambiente/verificarReserva/${idUsuario}/${idAmbiente}/${periodo}/${fecha}`,
        type: 'GET',
        success: function(res) {
            callback(res.reservaExistente);
        },
        error: function(error) {
            console.error("Error al verificar la reserva:", error);
            callback(false); 
        }
    });
}

function verificarNumeroReservasDelDia(idUsuario, idAmbiente, fecha, callback) {
    $.ajax({
        url: `http://localhost:5000/ambiente/numeroReservasDelDia/${idUsuario}/${idAmbiente}/${fecha}`,
        type: 'GET',
        success: function(res) {
            callback(res.numReservas);
        },
        error: function(error) {
            console.error("Error al verificar el número de reservas:", error);
            callback(0); 
        }
    });
}

function enviarReserva(idUsuario, idAmbiente, periodo, fecha) {
    $.ajax({
        url: `http://localhost:5000/ambiente/crearReserva`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ idUsuario, idAmbiente, periodo, fecha }),
        success: function(response) {
            alert(response.message);
        },
        error: function(error) {
            console.error("Error al crear la reserva:", error);
            alert("Error al realizar la reserva.");
        }
    });
}


