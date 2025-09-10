// Placeholder para tu endpoint de API de Spring Boot
const apiUrl =
  "https://trujillo-informado-backend-3b3a9e8b54ac.herokuapp.com/api/v1/reporte";

/**
 * Muestra un modal con un mensaje.
 * @param {string} title El título del modal.
 * @param {string} message El mensaje a mostrar.
 */
function showModal(title, message) {
  const modal = document.getElementById("modal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  modal.classList.remove("hidden");
}

/**
 * Maneja el envío del formulario.
 * @param {Event} event El evento de envío del formulario.
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Validar que se seleccionó un tipo de reporte y se ingresó una descripción
  const reportType = formData.get("reportType");
  const description = formData.get("description");

  if (!reportType || !description) {
    showModal(
      "Error de Validación",
      "Por favor, selecciona un tipo de reporte y describe el problema."
    );
    return;
  }

  // Mapear los valores del frontend a los enums del backend
  const tipoProblemaMap = {
    residuos_solidos: "RESIDUOS_SOLIDOS",
    maleza: "MALEZA",
    barrido: "BARRIDO",
  };

  const data = {
    tipoProblema: tipoProblemaMap[reportType],
    descripcion: description,
  };

  try {
    console.log("Enviando datos:", data); // Para debugging

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      showModal("¡Éxito!", "Reporte enviado correctamente.");
      form.reset();
    } else {
      const errorData = await response.json();
      showModal(
        "Error en el Envío",
        `Ha ocurrido un error al enviar el reporte: ${
          errorData.mensaje || response.statusText
        }`
      );
    }
  } catch (error) {
    console.error("Error completo:", error);
    showModal(
      "Error de Conexión",
      `No se pudo conectar con el servidor: ${error.message}`
    );
  }
}
