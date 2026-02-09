const express = require("express");
const path = require("path");

const app = express();

// Puerto obligatorio en Railway
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

// Ruta raíz: devuelve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
