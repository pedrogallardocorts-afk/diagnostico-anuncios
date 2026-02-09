import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/clinica", async (req, res) => {
  const {
    precio,
    superficie,
    zona,
    fotos,
    dias,
    visitas,
    contactos,
    descripcion
  } = req.body;

  let score = 100;
  let fricciones = [];
  let lectura = [];

  // --- REGLAS DURAS DE MERCADO ---

  // Precio / m²
  const precioM2 = precio / superficie;

  if (precioM2 > 5500) {
    score -= 20;
    fricciones.push("Precio alto para la zona según reacción habitual del mercado.");
  }

  // Fotos
  if (fotos < 10) {
    score -= 15;
    fricciones.push("Número de fotos insuficiente para generar confianza.");
  }

  // Tiempo publicado
  if (dias > 60) {
    score -= 20;
    fricciones.push("Anuncio quemado: más de 60 días publicado reduce visibilidad.");
  }

  // Conversión
  if (visitas && contactos !== undefined) {
    const ratio = contactos / visitas;

    if (ratio < 0.005) {
      score -= 25;
      fricciones.push("Muchas visitas y pocos contactos: el mercado descarta el anuncio.");
      lectura.push(
        "El precio o la presentación generan rechazo en compradores activos."
      );
    }
  }

  // Texto pobre
  if (descripcion.length < 200) {
    score -= 10;
    fricciones.push("Descripción genérica que no justifica el precio.");
  }

  // Limitar score
  if (score < 0) score = 0;

  // Estado
  let estado = "Validado";
  if (score < 70) estado = "Penalizado";
  if (score < 50) estado = "Crítico";

  const informe = {
    score,
    estado,
    resumen: `El mercado no está validando este anuncio en su estado actual.`,
    fricciones,
    lecturaProfesional: lectura,
    advertencia:
      "Si no se realizan ajustes, la visibilidad y el interés seguirán cayendo.",
    siguientePaso:
      "Revisar precio y presentación para reactivar el interés del mercado."
  };

  res.json(informe);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Clínica de anuncios activa en puerto", PORT);
});
