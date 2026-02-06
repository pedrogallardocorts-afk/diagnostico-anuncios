import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Para servir index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check Railway
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint diagnóstico
app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim().length < 20) {
      return res.status(400).json({
        error: "El texto es demasiado corto para analizarlo",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en anuncios inmobiliarios. Analizas anuncios y das un diagnóstico claro, estructurado y accionable.",
        },
        {
          role: "user",
          content: texto,
        },
      ],
      temperature: 0.4,
    });

    res.json({
      resultado: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al analizar el anuncio",
    });
  }
});

// Puerto Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
