$(document).ready(function () {
  const userName = sessionStorage.getItem("user") || "Nombre de Usuario";
  $("#nameAd").text(userName);
  llenarAmbientes();
  llenarFacilidades();
  $("#ambienteList").on("click", ".btn-save", modificarAmbiente);
  $("#downloadPDF").click(descargarTablaEnPDF);
  $("#downloadCSV").click(descargarCVS);
  $("#addAmbienteForm").on("submit", async function(event) {
    event.preventDefault(); 
    await crearAmbiente(); });
  $('#upload-form').on('submit', function(e) {
      e.preventDefault();
      agregarAmbientesCSV(); });                                
});

function llenarAmbientes() {
  $.ajax({
    url: "http://localhost:5000/ambiente/ambientesAdmin",
    type: "GET",
    dataType: "json",
    success: function (data) {
      data.forEach((aula) => {
        const facilidades = Array.isArray(aula.Facilidades)
          ? aula.Facilidades.join(", ")
          : aula.Facilidades || "";

        $("#ambienteList").append(`
          <tr>
              <td>
                  <select class="form-select tipo-selector" data-id="${
                    aula.id_tipo_am
                  }">
                      <!-- Aquí debes agregar las opciones de tu segunda consulta -->
                      <!-- Recuerda poner como "selected" al tipo de ambiente actual del aula -->
                  </select>
              </td>
              <td><input type="text" value="${
                aula.Numero
              }" class="form-control input-numero"></td>
              <td><input type="text" value="${
                aula.Capacidad
              }" class="form-control input-capacidad"></td>
              <td><input type="text" value="${
                aula.Descripcion
              }" class="form-control input-descripcion"></td>
              <td>${facilidades}</td>
              <td>
                  <select class="form-select activo-selector">
                      <option value="true" ${
                        aula.Activo ? "selected" : ""
                      }>Activo</option>
                      <option value="false" ${
                        !aula.Activo ? "selected" : ""
                      }>Inactivo</option>
                  </select>
              </td>
              <td>
                  <select class="form-select habilitado-selector">
                      <option value="true" ${
                        aula.Habilitado ? "selected" : ""
                      }>Habilitado</option>
                      <option value="false" ${
                        !aula.Habilitado ? "selected" : ""
                      }>Deshabilitado</option>
                  </select>
              </td>
              <td>
                <button class="btn  btn-save hover-color-change" data-id="${
                  aula.id_ambiente
                }">Guardar</button>
              </td>
          </tr>`);
      });
      llenarTiposDeAulas();
    },
    error: function (error) {
      console.error("Hubo un error al obtener las aulas:", error);
    },
  });
}

function llenarTiposDeAulas() {
  $.ajax({
    url: "http://localhost:5000/ambiente/tiposDeAmbientes",
    type: "GET",
    dataType: "json",
    success: function (tiposData) {
      $(".tipo-selector").each(function () {
        const currentTipoId = $(this).data("id");
        const options = tiposData
          .map(
            (tipo) =>
              `<option value="${tipo.id_tipo_am}" ${
                currentTipoId === tipo.id_tipo_am ? "selected" : ""
              }>${tipo.nombre_tipo}</option>`
          )
          .join("");
        $(this).append(options);
      });
    },
    error: function (error) {
      console.error("Hubo un error al obtener los tipos de ambiente:", error);
    },
  });

  $.ajax({
    url: "http://localhost:5000/ambiente/tiposDeAmbientes",
    type: "GET",
    dataType: "json",
    success: function (tiposData) {
      const options = tiposData
        .map(
          (tipo) =>
            `<option value="${tipo.id_tipo_am}">${tipo.nombre_tipo}</option>`
        )
        .join("");
      $("#tipoAula").append(options);
    },
    error: function (error) {
      console.error("Error obteniendo tipos de ambiente:", error);
    },
  });
}

function llenarFacilidades() {
  $.ajax({
    url: "http://localhost:5000/ambiente/facilidades",
    type: "GET",
    dataType: "json",
    success: function (data) {
      var facilidadesHtml = "";
      data.forEach(function (facilidad) {
        facilidadesHtml += `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${facilidad.id_facilidad}" id="facilidad${facilidad.id_facilidad}" name="facilidades">
            <label class="form-check-label" for="facilidad${facilidad.id_facilidad}">
              ${facilidad.nombre_faci}
            </label>
          </div>
        `;
      });
      $("#facilidadesCheckboxes").html(facilidadesHtml);
    },
    error: function (error) {
      console.error("Hubo un error al obtener las facilidades:", error);
    },
  });
}

async function modificarAmbiente() {
  const id = $(this).data("id");
  const numero = $(this).closest("tr").find(".input-numero").val();
  const capacidad = $(this).closest("tr").find(".input-capacidad").val();
  const descripcion = $(this).closest("tr").find(".input-descripcion").val();
  const tipoAmbiente = $(this).closest("tr").find(".tipo-selector").val();
  const activo =
    $(this).closest("tr").find(".activo-selector").val() === "true";
  const habilitado =
    $(this).closest("tr").find(".habilitado-selector").val() === "true";

  const validacion = await validarDatos(numero, capacidad, descripcion, id);

  if (validacion !== true) {
    alert(validacion);
    return;
  }

  actualizarAula(
    id,
    numero,
    capacidad,
    descripcion,
    tipoAmbiente,
    activo,
    habilitado
  );
}

async function validarDatos(numero, capacidad, descripcion, id) {
  const regexNumero = /^[0-9]{3}[a-zA-Z]{1}$/;
  const capacidadValida =
    !isNaN(capacidad) && capacidad >= 10 && capacidad <= 100;

  if (!regexNumero.test(numero)) {
    return "El campo 'Número de Aula' debe tener tres números seguidos de una letra.";
  }

  const existeAula = await buscarAmbientePorNumero(numero, id);
  if (existeAula) {
    return "El número de aula ya existe.";
  }

  if (!capacidadValida) {
    return "El campo 'Capacidad' debe ser un número entre 10 y 100.";
  }

  if (descripcion.trim() === "") {
    descripcion = "";
  }

  return true;
}

function buscarAmbientePorNumero(numero, id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `http://localhost:5000/ambiente/buscarAmbiente/${numero}`,
      type: "GET",
      success: function (data) {
        if (data) {
          if (data.id_ambiente === id) {
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          resolve(false);
        }
      },
      error: function (error) {
        if (error.status === 404) {
          resolve(false);
        } else {
          reject("Error al obtener el ambiente.");
        }
      },
    });
  });
}

function actualizarAula(
  id,
  numero,
  capacidad,
  descripcion,
  tipoAmbiente,
  activo,
  habilitado
) {
  $.ajax({
    url: `http://localhost:5000/ambiente/actualizarAmbiente/${id}`,
    type: "PUT",
    contentType: "application/json", 
    data: JSON.stringify({
      numero,
      capacidad,
      descripcion,
      tipo_ambiente: tipoAmbiente,
      activo,
      habilitado,
    }),
    success: function (response) {
      console.log("Aula actualizada correctamente:", response);
      alert("Ambiente actualizado correctamente");
    },
    error: function (error) {
      console.error("Hubo un error al actualizar el ambiente:", error);
    },
  });
}
function descargarTablaEnPDF() {
  const doc = new window.jspdf.jsPDF();

  doc.setFontSize(20);
  doc.text("Tabla de Ambientes", 14, 22);

  const headers = [
    [
      "Tipo de Aula",
      "Número de Aula",
      "Capacidad",
      "Descripción",
      "Facilidades",
      "Activo",
      "Habilitado",
    ],
  ];

  const data = [];
  $("#ambienteList > tr").each(function () {
    let row = [];
    $(this)
      .find("td")
      .each(function () {
        let cellText;
        if ($(this).children().is("select")) {
          cellText = $(this).find("option:selected").text();
        } else if ($(this).children().is("input")) {
          cellText = $(this).children().val();
        } else {
          cellText = $(this).text();
        }
        row.push(cellText);
      });
    data.push(row);
  });

  doc.autoTable({
    head: headers,
    body: data,
    startY: 32,
    headStyles: { fillColor: [220, 220, 220] },
    theme: "grid",
    pageBreak: "auto",
  });

  doc.save("Tabla-Ambientes.pdf");
}

function descargarCVS() {
  $.ajax({
    url: "http://localhost:5000/ambiente/ambientesAdmin",
    type: "GET",
    success: function (data) {
      convertToCSV(data);
    },
    error: function (error) {
      console.error("Error al obtener datos:", error);
    },
  });
}

function convertToCSV(data) {
  const csvRows = [];
  const headers = [
    "Tipo de aula",
    "Numero",
    "Capacidad",
    "Descripcion",
    "Activo",
    "Habilitado",
    "Facilidades",
  ];
  csvRows.push(headers.join(","));

  for (let item of data) {
    const row = [
      item["Tipo de ambiente"],
      item["Numero"],
      item["Capacidad"],
      item["Descripcion"],
      item["Activo"] == 1 ? "Activo" : "Inactivo", 
      item["Habilitado"] == 1 ? "Habilitado" : "Deshabilitado", 
      item["Facilidades"],
    ];
    csvRows.push(row.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "Tabla-Ambientes.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function crearAmbiente(){
  const validationResult = await validarDatos($("#numeroAula").val(), $("#capacidad").val(), $("#descripcion").val(), -1);
  if (validationResult === true) {
      agregarAmbiente();
  } else {
      alert(validationResult);
  }

}

function agregarAmbiente() {
  const tipoAula = $("#tipoAula").val();
  const numeroAula = $("#numeroAula").val();
  const capacidad = $("#capacidad").val();
  const descripcion = $("#descripcion").val();
  const facilidadesSeleccionadas = [];
  
  $("input[name='facilidades']:checked").each(function() {
      facilidadesSeleccionadas.push($(this).val());
  });
  
  const ambiente = {
      tipo_ambiente: tipoAula,
      numero: numeroAula,
      capacidad: capacidad,
      descripcion: descripcion,
      facilidades: facilidadesSeleccionadas
  };
 
  $.ajax({
      url: "http://localhost:5000/ambiente/crearAmbiente",
      type: "POST",
      data: JSON.stringify(ambiente),
      contentType: "application/json",
      success: function(response) {
          console.log("Respuesta del servidor:", response);
          alert("Ambiente agregado con éxito.");
          location.reload(); 
      },
      error: function(error) {
          console.error("Error al agregar el ambiente:", error);
      }
  });
}

function agregarAmbientesCSV(){
  const fileInput = $('input[type="file"]')[0];
  const formData = new FormData();
  formData.append('archivo', fileInput.files[0]);
    
    fetch('/agregarAmbientes', {
      method: 'POST',
      body: formData
     })
    .then(response => response.json())
    .then(data => { 
    if (data.message) {
      alert(data.message);
    }
    location.reload();
    })
    .catch(error => {
      onsole.error('Error al cargar el archivo:', error);
    });
}


