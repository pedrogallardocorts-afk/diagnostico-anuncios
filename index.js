const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz (MUY IMPORTANTE)
app.get("/", (req, res) => {
  res.send(`
    <h1>Clínica de Anuncios Inmobiliarios</h1>
    <p>Servidor activo. La app está funcionando correctamente.</p>
  `);
});

// Endpoint de diagnóstico (placeholder por ahora)
app.post("/diagnostico", (req, res) => {
  res.json({
    status: "ok",
    mensaje: "Endpoint de diagnóstico operativo",
    datos_recibidos: req.body
  });
});

// Arranque del servidor (CRÍTICO)
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
