const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint de diagnóstico
app.post("/clinica", (req, res) => {
  const {
    precio,
    superficie,
    zona,
    fotos,
    dias,
    visitas = 0,
    contactos = 0,
    descripcion = ""
  } = req.body;

  let score = 100;
  let fricciones = [];

  if (dias > 60) {
    score -= 20;
    fricciones.push("Anuncio con desgaste por antigüedad");
  }

  if (visitas > 300 && contactos < 3) {
    score -= 25;
    fricciones.push("Muchas visitas pero pocos contactos (rechazo del mercado)");
  }

  if (fotos < 10) {
    score -= 15;
    fricciones.push("Número de fotos insuficiente");
  }

  if (descripcion.length < 120) {
    score -= 10;
    fricciones.push("Descripción poco informativa");
  }

  if (score < 0) score = 0;

  res.json({
    score,
    estado: score >= 70 ? "Visible" : "Penalizado",
    resumen: "Así está reaccionando el mercado a tu anuncio hoy.",
    fricciones,
    lecturaProfesional: [
      "El comportamiento del anuncio no valida el posicionamiento actual.",
      "El mercado está decidiendo, no el texto."
    ],
    advertencia:
      "Si no se actúa, la visibilidad seguirá cayendo de forma progresiva.",
    siguientePaso:
      "Ajustar el posicionamiento para provocar reacción real del mercado."
  });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
