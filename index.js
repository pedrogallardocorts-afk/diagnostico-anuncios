const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Servir archivos estáticos (index.html)
app.use(express.static(__dirname));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint de diagnóstico (placeholder)
app.post("/diagnostico", (req, res) => {
  res.json({
    estado: "OK",
    mensaje: "Diagnóstico recibido correctamente",
    datos: req.body
  });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
