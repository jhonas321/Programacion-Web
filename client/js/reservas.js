$(document).ready(function() {
    const userName = sessionStorage.getItem("user") || "Nombre de Usuario";
    const idUsuario = sessionStorage.getItem('userId');
    $("#nameAd").text(userName);
    $("#downloadPDF").click(descargarTablaEnPDF);
    if (idUsuario) {
        cargarReservas(idUsuario);
    } else {
        alert("No se pudo identificar al usuario.");
    }
});

function cargarReservas(idUsuario) {
  $.ajax({
      url: `http://localhost:5000/ambiente/historial/${idUsuario}`,
      type: 'GET',
      success: function (reservas) {
          mostrarReservas(reservas);
      },
      error: function (error) {
          console.error("Error al obtener reservas:", error);
          alert("Error al cargar reservas.");
      }
  });
}

function mostrarReservas(reservas) {
    const tabla = $('#tablaReservas tbody');
    tabla.empty();

    reservas.forEach(reserva => {
        const periodo = `${reserva.hora_ini} - ${reserva.hora_fin}`;
        const facilidades = reserva.facilidades ? reserva.facilidades.split(',').join(', ') : 'Sin facilidades';
        const claseEstado = `estado-${reserva.estado.toLowerCase()}`;
        const fila = `
         
            <tr class="${claseEstado}" data-id="${reserva.id_reserva}">
                <td>${reserva.nombre_tipo}</td>
                <td>${reserva.numero}</td>
                <td>${reserva.capacidad}</td>
                <td>${reserva.descripcion || 'Sin descripción'}</td>
                <td>${facilidades}</td>
                <td>${reserva.fecha}</td>
                <td>${periodo}</td>
                <td>${reserva.estado}</td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function descargarTablaEnPDF() {
    const doc = new window.jspdf.jsPDF();

    const headers = [
        ["Tipo", "Número", "Capacidad", "Descripción", "Facilidades", "Fecha", "Periodo", "Estado"]
    ];

    const data = [];
    $('#tablaReservas tbody tr').each(function() {
        const row = [];
        $(this).find('td').each(function() {
            let text = $(this).text().trim();

            if ($(this).index() === 5) {
                const fechaObj = new Date(text);
                text = fechaObj.toLocaleDateString();
            }
            row.push(text);
        });
        data.push(row);
    });

    doc.autoTable({
        head: headers,
        body: data,
        theme: 'striped',
        styles: { fontSize: 8 }
    });

    doc.save('Historial_Reservas.pdf');
}

setInterval(function() {
    const idUsuario = sessionStorage.getItem('userId');
    if (idUsuario) {
        cargarReservas(idUsuario);
    }
}, 30000);



