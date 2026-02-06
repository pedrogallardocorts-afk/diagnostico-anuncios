import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// --- Fix __dirname (ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Servir frontend ---
app.use(express.static(__dirname));

// --- OpenAI ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Health ---
app.get("/health", (req, res) => {
  res.send("OK");
});

// --- HOME ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =======================================================
// ============ ENDPOINT CLÍNICA DE ANUNCIOS ==============
// =======================================================

app.post("/clinica", async (req, res) => {
  try {
    const {
      url,
      precio,
      descripcion,
      numFotos,
      zona,
      metros,
      diasPublicado,
    } = req.body;

    // -------- VALIDACIONES CLÍNICAS --------
    if (!url || !precio || !descripcion || !zona || !metros) {
      return res.status(400).json({
        error:
          "Faltan datos esenciales para realizar el diagnóstico clínico.",
      });
    }

    // -------- PROMPT DEFINITIVO --------
    const prompt = `
Actúas como un ANALISTA INMOBILIARIO INDEPENDIENTE en España.

Tu función es diagnosticar por qué un anuncio inmobiliario real, ya publicado en un portal, NO está generando la demanda esperada.

NO eres un redactor.
NO eres un comercial.
NO das instrucciones paso a paso.

Hablas con un PROPIETARIO frustrado pero racional.

Analiza SIEMPRE la coherencia entre los siguientes datos:

URL DEL ANUNCIO:
${url}

PRECIO:
${precio} €

SUPERFICIE:
${metros} m²

ZONA / BARRIO:
${zona}

NÚMERO DE FOTOS:
${numFotos || "No especificado"}

TIEMPO PUBLICADO:
${diasPublicado || "No especificado"}

DESCRIPCIÓN COMPLETA:
${descripcion}

INSTRUCCIONES CLAVE:
- No prometas resultados.
- No des soluciones ejecutables completas.
- Usa un tono clínico, directo y profesional.
- Diagnostica fricciones y riesgos reales.
- Escribe como alguien que ha visto cientos de anuncios fallar.

FORMATO DE SALIDA OBLIGATORIO:

CALIDAD GLOBAL: X / 100
ESTADO DEL ANUNCIO:
RIESGO ACTUAL:

VEREDICTO EJECUTIVO:
(párrafo único)

FRICCIONES DETECTADAS:
- Precio y mercado
- Presentación y contenido
- Material visual
- Tiempo y desgaste

CONSECUENCIAS SI NO SE ACTÚA:
(párrafo)

LÍNEAS DE ACTUACIÓN RECOMENDADAS:
- …
- …
- …

CIERRE:
(párrafo final silencioso, sin vender servicios)
`;

    // -------- LLAMADA OPENAI --------
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Eres un analista inmobiliario senior especializado en diagnóstico de anuncios fallidos.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      informe: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error generando el diagnóstico clínico.",
    });
  }
});

// --- PUERTO RAILWAY ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
