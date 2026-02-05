import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// ===== OpenAI client =====
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Puerto (Railway) =====
const PORT = process.env.PORT || 8080;

// ===== Home con interfaz HTML =====
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Diagnóstico de Anuncios</title>
      <style>
        body { font-family: Arial, sans-serif; background:#f4f4f4; padding:40px; }
        textarea { width:100%; height:150px; }
        button { padding:10px 20px; margin-top:10px; }
        .respuesta { margin-top:20px; background:#fff; padding:20px; }
      </style>
    </head>
    <body>
      <h1>Diagnóstico de anuncios inmobiliarios</h1>
      <textarea id="texto" placeholder="Pega aquí el anuncio..."></textarea><br/>
      <button onclick="enviar()">Analizar</button>
      <div class="respuesta" id="respuesta"></div>

      <script>
        async function enviar() {
          const texto = document.getElementById("texto").value;
          document.getElementById("respuesta").innerText = "Analizando...";

          const res = await fetch("/diagnostico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto })
          });

          const data = await res.json();
          document.getElementById("respuesta").innerText =
            data.resultado || data.error;
        }
      </script>
    </body>
    </html>
  `);
});

// ===== Endpoint OpenAI =====
app.post("/diagnostico", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un experto en anuncios inmobiliarios y copy de venta." },
        { role: "user", content: texto }
      ],
    });

    res.json({
      resultado: completion.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});


