$(document).ready(function() {
  const userName = sessionStorage.getItem("user") || "Nombre de Usuario";
  $("#nameAd").text(userName);
  cargarReservas();
  $("#downloadPDF").click(descargarTablaEnPDF);
  
  $('#tablaReservas').on('change', '.estado-reserva', function() {
      const idReserva = $(this).closest('tr').data('id');
      const nuevoEstado = $(this).val();
      actualizarEstadoReserva(idReserva, nuevoEstado);
  });
});

function cargarReservas() {
  $.ajax({
      url: 'http://localhost:5000/ambiente/reservasAdmin',
      type: 'GET',
      success: function(reservas) {
          mostrarReservas(reservas);
      },
      error: function(error) {
          console.error("Error al cargar reservas:", error);
          alert("Error al cargar reservas.");
      }
  });
}

function mostrarReservas(reservas) {
  const tabla = $('#tablaReservas tbody');
  tabla.empty();

  reservas.forEach(reserva => {
    const facilidades = reserva.Facilidades ? reserva.Facilidades.split(',').join(', ') : 'Sin facilidades';
    const claseEstado = `estado-${reserva.Estado.toLowerCase()}`;
    const fechaObj = new Date(reserva.Fecha);
    const fecha = fechaObj.toISOString().split('T')[0];
    const fila = `
          <tr class="${claseEstado}" data-id="${reserva.id_reserva}">
              <td>${reserva.NombreUsuario}</td>
              <td>${reserva.TipoAmbiente}</td>
              <td>${reserva.Numero}</td>
              <td>${reserva.Capacidad}</td>
              <td>${reserva.Descripcion || 'Sin descripción'}</td>
              <td>${facilidades}</td>
              <td>${fecha}</td>
              <td>${reserva.HoraInicio} - ${reserva.HoraFin}</td>
              <td>
                  <select class="estado-reserva">
                      <option value="Pendiente" ${reserva.Estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                      <option value="Aceptado" ${reserva.Estado === 'Aceptado' ? 'selected' : ''}>Aceptado</option>
                      <option value="Rechazado" ${reserva.Estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                  </select>
              </td>
          </tr>
      `;
      tabla.append(fila);
  });
}

function actualizarEstadoReserva(idReserva, nuevoEstado) {
  $.ajax({
      url: `http://localhost:5000/ambiente/actualizarEstadoReserva/${idReserva}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ estado: nuevoEstado }),
      success: function(response) {
          alert("Estado actualizado correctamente.");
      },
      error: function(error) {
          console.error("Error al actualizar el estado de la reserva:", error);
          alert("Error al actualizar el estado.");
      }
  });
}

function descargarTablaEnPDF() {
    const doc = new window.jspdf.jsPDF();

    const headers = [
        ["Usuario", "Tipo", "Número", "Capacidad", "Descripción", "Facilidades", "Fecha", "Periodo", "Estado"]
    ];

    const data = [];
    $('#tablaReservas tbody tr').each(function() {
        const row = [];
        $(this).find('td').not(':last-child').each(function() {
            let text = $(this).text().trim();
            if ($(this).index() === 6) {
                const fechaObj = new Date(text);
                text = fechaObj.toLocaleDateString();
            }
            row.push(text);
        });
        const estado = $(this).find('.estado-reserva').val();
        row.push(estado);
        data.push(row);
    });

    doc.autoTable({
        head: headers,
        body: data,
        theme: 'striped',
        styles: { fontSize: 8 }
    });

    doc.save('Reservas.pdf');
}

setInterval(function() {
    cargarReservas()
}, 10000);
