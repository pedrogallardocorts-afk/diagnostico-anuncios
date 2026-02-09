const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la landing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint principal de análisis
app.post("/analizar", (req, res) => {
  const {
    visitas,
    guardados,
    contactos,
    dias
  } = req.body;

  const v = Number(visitas);
  const g = Number(guardados);
  const c = Number(contactos);
  const d = Number(dias);

  let texto = [];
  let estado = "";

  // --- LECTURA DE MERCADO (HUMANA) ---

  if (v > 300 && c <= 2) {
    estado = "Se ve, pero no convence";
    texto.push(
      `Tu anuncio tiene movimiento, pero la gente entra, mira… y sigue buscando.`
    );
    texto.push(
      `Cuando pasa esto, suele ser porque algo frena la decisión de llamar.`
    );
  }

  if (v < 150 && d > 20) {
    estado = "Poca visibilidad";
    texto.push(
      `El anuncio no está recibiendo suficiente atención para el tiempo que lleva publicado.`
    );
    texto.push(
      `Cuando ocurre esto, el portal suele mostrar antes otros anuncios.`
    );
  }

  if (c >= 5 && d < 30) {
    estado = "Interés real";
    texto.push(
      `El anuncio está generando interés y contactos.`
    );
    texto.push(
      `En estos casos, la venta suele depender más del encaje del comprador que del anuncio.`
    );
  }

  if (estado === "") {
    estado = "Interés irregular";
    texto.push(
      `El anuncio tiene algo de movimiento, pero no termina de arrancar.`
    );
    texto.push(
      `La reacción del mercado es tibia.`
    );
  }

  if (d > 60) {
    texto.push(
      `Además, al llevar tiempo publicado, cada semana cuesta un poco más reactivar el interés.`
    );
  }

  texto.push(
    `Si no se toca nada, lo normal es que el anuncio vaya perdiendo fuerza poco a poco.`
  );

  texto.push(
    `Cuando un anuncio se reactiva bien, no es por retocar detalles, sino por provocar una reacción clara del mercado.`
  );

  res.json({
    estado,
    mensaje: texto.join(" ")
  });
});

// Arranque
app.listen(PORT, () => {
  console.log(`Clínica de anuncios activa en puerto ${PORT}`);
});
