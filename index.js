import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// ===== OpenAI =====
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Health check (OBLIGATORIO para Railway) =====
app.get("/", (req, res) => {
  res.send("diagnostico-anuncios OK");
});

// ===== Endpoint de prueba con OpenAI =====
app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un experto en anuncios inmobiliarios." },
        { role: "user", content: texto },
      ],
    });

    res.json({
      resultado: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
});

// ===== PUERTO CORRECTO PARA RAILWAY =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


