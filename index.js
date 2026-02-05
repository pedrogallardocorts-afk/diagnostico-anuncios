import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// --- Necesario para servir index.html ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// --- OpenAI ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Health check (Railway) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Endpoint IA ---
app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({ error: "Falta el texto del anuncio" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en marketing inmobiliario. Analiza anuncios inmobiliarios y da mejoras claras, directas y accionables.",
        },
        {
          role: "user",
          content: texto,
        },
      ],
    });

    res.json({
      resultado: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al procesar el diagnóstico",
    });
  }
});

// --- Puerto Railway ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});

   
