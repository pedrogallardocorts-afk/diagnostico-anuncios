const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint principal de la clínica
app.post("/clinica", (req, res) => {
  const {
    precio,
    superficie,
    zona,
    fotos,
    dias,
    visitas,
    contactos,
    guardados,
    descripcion
  } = req.body;

  // Normalización básica
  const p = Number(precio);
  const m2 = Number(superficie);
  const d = Number(dias);
  const v = Number(visitas || 0);
  const c = Number(contactos || 0);
  const g = Number(guardados || 0);
  const f = Number(fotos || 0);

  const precioM2 = m2 > 0 ? Math.round(p / m2) : null;

  let score = 100;
  const fricciones = [];
  const hechos = [];
  const lectura = [];

  // Hechos
  hechos.push(`Precio: ${p.toLocaleString("es-ES")} €`);
  hechos.push(`Superficie: ${m2} m²`);
  hechos.push(`Precio/m²: ${precioM2 ? precioM2.toLocaleString("es-ES") + " €" : "N/D"}`);
  hechos.push(`Zona: ${zona}`);
  hechos.push(`Días publicado: ${d}`);
  hechos.push(`Fotos: ${f}`);
  if (v) hechos.push(`Visitas: ${v}`);
  if (g) hechos.push(`Guardados: ${g}`);
  if (c) hechos.push(`Contactos: ${c}`);

  // Reglas duras (scoring realista)
  if (d > 60) {
    score -= 20;
    fricciones.push("Anuncio quemado por tiempo en portal");
    lectura.push("A partir de 60 días el portal reduce visibilidad si no hay ajustes.");
  }

  if (f < 10) {
    score -= 15;
    fricciones.push("Número de fotos por debajo del estándar");
    lectura.push("Los anuncios con pocas fotos generan desconfianza y menos clics.");
  }

  if (v > 0 && c === 0) {
    score -= 25;
    fricciones.push("Muchas visitas sin contactos");
    lectura.push("El mercado ve el anuncio pero descarta contactar. Precio o presentación generan rechazo.");
  }

  if (v > 0 && c > 0 && c / v < 0.005) {
    score -= 15;
    fricciones.push("Conversión muy baja");
    lectura.push("El interés no se transforma en acción. Falta alineación entre precio y percepción.");
  }

  if (descripcion && descripcion.length < 200) {
    score -= 10;
    fricciones.push("Descripción demasiado genérica");
    lectura.push("El texto no justifica el precio ni resuelve objeciones del comprador.");
  }

  if (score < 0) score = 0;

  // Diagnóstico ejecutivo
  let estado = "Competitivo";
  if (score < 80) estado = "Con fricciones claras";
  if (score < 60) estado = "Penalizado por el mercado";

  const respuesta = {
    calidad_global: `${score} / 100`,
    estado_del_anuncio: estado,
    resumen_ejecutivo: `El mercado está reaccionando a tu anuncio de forma coherente con los datos observados.`,
    hechos_objetivos: hechos,
    fricciones_detectadas: fricciones,
    lectura_profesional: lectura,
    conclusion: "El comportamiento del portal refleja la respuesta real de los compradores a este anuncio."
  };

  res.json(respuesta);
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Clínica de anuncios activa en puerto ${PORT}`);
});
