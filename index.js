import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API Diagnóstico Anuncios funcionando" });
});

app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto del anuncio" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "Eres un experto en marketing inmobiliario y copywriting. Analizas anuncios de pisos y detectas errores claros, explicando qué falla y cómo mejorarlo."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: texto
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const output =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Sin respuesta";

    res.json({ diagnostico: output });

  } catch (error) {
    res.status(500).json({
      error: "Error interno",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});


