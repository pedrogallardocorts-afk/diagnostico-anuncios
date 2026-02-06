import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// --- Fix para __dirname en ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Servir frontend ---
app.use(express.static(__dirname));

// --- OpenAI ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Health check ---
app.get("/health", (req, res) => {
  res.send("OK");
});

// --- Endpoint diagnóstico ---
app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un experto en marketing inmobiliario en España.

Devuelve SIEMPRE este formato:

SCORE: X/100

TITULAR:
- Qué funciona
- Qué no funciona

DESCRIPCIÓN:
- Qué transmite bien
- Qué falta

ATRACCIÓN DE COMPRADORES:
- Nivel de interés
- Riesgos

RECOMENDACIONES:
1. Mejora título
2. Mejora descripción
3. Estrategia

CIERRE:
Una frase directa para el propietario.
`
        },
        { role: "user", content: texto }
      ]
    });

    res.json({
      resultado: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error analizando el anuncio" });
  }
});

// --- ARRANQUE OBLIGATORIO PARA RAILWAY ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
