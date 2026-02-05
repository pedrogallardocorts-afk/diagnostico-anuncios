import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// ===== OpenAI =====
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Página principal (FRONTEND) =====
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Diagnóstico de anuncios inmobiliarios</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    textarea {
      width: 100%;
      height: 150px;
      padding: 10px;
      font-size: 16px;
    }
    button {
      margin-top: 10px;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    #resultado {
      margin-top: 20px;
      background: #fff;
      padding: 15px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>Diagnóstico de anuncios inmobiliarios</h1>
  <p>Pega aquí el texto de tu anuncio:</p>

  <textarea id="texto"></textarea>
  <br />
  <button onclick="analizar()">Analizar anuncio</button>

  <div id="resultado"></div>

  <script>
    async function analizar() {
      const texto = document.getElementById("texto").value;
      const resultado = document.getElementById("resultado");

      resultado.innerText = "Analizando...";

      const res = await fetch("/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
      });

      const data = await res.json();
      resultado.innerText = data.resultado || data.error;
    }
  </script>
</body>
</html>
  `);
});

// ===== API de diagnóstico =====
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
    res.status(500).json({ error: error.message });
  }
});

// ===== Puerto (Railway) =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
