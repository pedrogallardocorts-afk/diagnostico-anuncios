/**
 * Clínica de anuncios inmobiliarios
 * Backend mínimo, estable y productivo
 * Sirve frontend + endpoint de diagnóstico
 */

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------
// Middleware
// --------------------
app.use(express.json());

// --------------------
// Servir frontend
// --------------------
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --------------------
// Endpoint principal de diagnóstico
// --------------------
app.post("/clinica", async (req, res) => {
  try {
    const {
      url,
      precio,
      superficie,
      zona,
      fotos,
      dias_publicado,
      visitas,
      guardados,
      contactos,
      descripcion,
    } = req.body;

    // -------- VALIDACIONES BÁSICAS --------
    if (!precio || !superficie || !zona) {
      return res.status(400).json({
        error: "Faltan datos mínimos para el diagnóstico.",
      });
    }

    const precioM2 = Math.round(precio / superficie);

    // -------- REGLAS DURAS (NO IA, MERCADO) --------
    let score = 100;
    let fricciones = [];

    if (dias_publicado && dias_publicado > 60) {
      score -= 25;
      fricciones.push(
        "El anuncio lleva más de 60 días publicado. A partir de este punto el portal reduce visibilidad."
      );
    }

    if (visitas && contactos !== undefined && visitas > 0) {
      const ratio = contactos / visitas;
      if (ratio < 0.005) {
        score -= 30;
        fricciones.push(
          "Muchas visitas y muy pocos contactos. El mercado está descartando el anuncio (precio o presentación)."
        );
      }
    }

    if (fotos && fotos < 8) {
      score -= 15;
      fricciones.push(
        "Número de fotos por debajo del estándar. Reduce confianza y conversión."
      );
    }

    if (descripcion && descripcion.length < 200) {
      score -= 10;
      fricciones.push(
        "Descripción demasiado genérica. No justifica el precio ni diferencia el anuncio."
      );
    }

    if (score < 0) score = 0;

    // -------- DIAGNÓSTICO EJECUTIVO --------
    let estado = "Correcto";
    if (score < 70) estado = "Débil";
    if (score < 50) estado = "Penalizado";

    const diagnostico = {
      calidad_global: `${score} / 100`,
      estado_anuncio: estado,
      precio_m2: `${precioM2} €/m²`,
      resumen:
        "El comportamiento del mercado indica fricciones claras entre precio, presentación y respuesta de los compradores.",
      fricciones_detectadas: fricciones,
      lectura_profesional: [
        "El mercado valida o rechaza un anuncio en las primeras semanas.",
        "Cuando hay visitas sin contactos, el problema no es el portal, es la propuesta.",
        "Sin ajustes relevantes, la visibilidad seguirá cayendo.",
      ],
      impacto_si_no_se_actua:
        "Mayor desgaste del anuncio, reducción progresiva de visibilidad y necesidad de ajustes más agresivos más adelante.",
      tipo_de_acciones_con_impacto: [
        "Replanteamiento del precio según reacción real del mercado.",
        "Mejora clara de la propuesta visual y narrativa.",
        "Reposicionamiento antes de que el anuncio quede quemado.",
      ],
    };

    return res.json(diagnostico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error interno al generar el diagnóstico.",
    });
  }
});

// --------------------
// Arranque servidor
// --------------------
app.listen(PORT, () => {
  console.log(`Clínica de anuncios activa en puerto ${PORT}`);
});
