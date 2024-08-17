const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { query } = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ruta para agregar una camioneta
app.post('/camionetas', async (req, res) => {
  const { placa } = req.body;
  const sql = 'INSERT INTO Camionetas (Placa) VALUES (?)';
  try {
    await query(sql, [placa]);
    res.status(201).send('Camioneta agregada correctamente');
  } catch (err) {
    console.error('Error al agregar camioneta:', err);
    res.status(500).send('Error al agregar camioneta');
  }
});

// Ruta para agregar un registro de kilómetros
app.post('/registroKilometros', async (req, res) => {
  const { camionetaID, kilometros } = req.body;

  // Verificar que camionetaID no esté vacío
  if (!camionetaID || !kilometros) {
    return res.status(400).send('Camioneta_ID y kilómetros son necesarios');
  }

  const checkSql = 'SELECT * FROM Camionetas WHERE ID = ?';
  try {
    // Verifica si el Camioneta_ID existe
    const [camionetas] = await query(checkSql, [camionetaID]);
    if (camionetas.length === 0) {
      return res.status(404).send('Camioneta_ID no encontrado en la tabla Camionetas');
    }

    // Insertar en RegistroKilometros
    const sql = 'INSERT INTO RegistroKilometros (Camioneta_ID, Fecha, Kilometros) VALUES (?, NOW(), ?)';
    await query(sql, [camionetaID, kilometros]);
    res.status(201).send('Registro de kilómetros agregado correctamente');
  } catch (err) {
    console.error('Error al agregar registro de kilómetros:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).send('Error: El Camioneta_ID proporcionado no existe en la tabla Camionetas');
    } else {
      res.status(500).send('Error al agregar registro de kilómetros');
    }
  }
});


// Ruta para agregar un mantenimiento
app.post('/mantenimiento', async (req, res) => {
  const { camionetaID, tipoMantenimiento, descripcion } = req.body;
  const sql = 'INSERT INTO Mantenimiento (Camioneta_ID, Fecha, Tipo_Mantenimiento, Descripcion) VALUES (?, NOW(), ?, ?)';
  try {
    await query(sql, [camionetaID, tipoMantenimiento, descripcion]);
    res.status(201).send('Mantenimiento agregado correctamente');
  } catch (err) {
    console.error('Error al agregar mantenimiento:', err);
    res.status(500).send('Error al agregar mantenimiento');
  }
});

// Ruta para agregar detalles de cambio de llantas
app.post('/detalleCambioLlantas', async (req, res) => {
  const { mantenimientoID, llanta, cantidad } = req.body;
  const sql = 'INSERT INTO DetalleCambioLlantas (Mantenimiento_ID, Llanta, Cantidad) VALUES (?, ?, ?)';
  try {
    await query(sql, [mantenimientoID, llanta, cantidad]);
    res.status(201).send('Detalle de cambio de llantas agregado correctamente');
  } catch (err) {
    console.error('Error al agregar detalle de cambio de llantas:', err);
    res.status(500).send('Error al agregar detalle de cambio de llantas');
  }
});

// Ruta para agregar observaciones
app.post('/observaciones', async (req, res) => {
  const { camionetaID, tipoObservacion, ubicacion, descripcion } = req.body;
  const sql = 'INSERT INTO Observaciones (Camioneta_ID, Fecha, Tipo_Observacion, Ubicacion, Descripcion) VALUES (?, NOW(), ?, ?, ?)';
  try {
    await query(sql, [camionetaID, tipoObservacion, ubicacion, descripcion]);
    res.status(201).send('Observación agregada correctamente');
  } catch (err) {
    console.error('Error al agregar observación:', err);
    res.status(500).send('Error al agregar observación');
  }
});

// Ruta para obtener datos de RegistroKilometros
app.get('/registroKilometros', async (req, res) => {
  const sql = 'SELECT * FROM RegistroKilometros';
  try {
    const results = await query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener datos de registro de kilómetros:', err);
    res.status(500).send('Error al obtener datos de registro de kilómetros');
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
