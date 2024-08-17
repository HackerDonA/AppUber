const mysql = require('mysql2/promise');

// Configura la conexión a la base de datos
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',  // Reemplaza con la contraseña de tu base de datos
  database: 'Uber'
};

async function runTest() {
  let connection;
  
  try {
    // Conéctate a la base de datos
    connection = await mysql.createConnection(connectionConfig);
    
    // Inserta una camioneta
    let [result] = await connection.execute('INSERT INTO Camionetas (Placa) VALUES (?)', ['ABC123']);
    const camionetaID = result.insertId;
    console.log('Camioneta agregada: ID =', camionetaID);

    // Inserta un registro de kilómetros
    [result] = await connection.execute('INSERT INTO RegistroKilometros (Camioneta_ID, Fecha, Kilometros) VALUES (?, NOW(), ?)', [camionetaID, 1000]);
    console.log('Registro de kilómetros agregado');

    // Inserta un mantenimiento
    [result] = await connection.execute('INSERT INTO Mantenimiento (Camioneta_ID, Fecha, Tipo_Mantenimiento, Descripcion) VALUES (?, NOW(), ?, ?)', [camionetaID, 'Cambio de aceite', 'Cambio de aceite en motor']);
    const mantenimientoID = result.insertId;
    console.log('Mantenimiento agregado: ID =', mantenimientoID);

    // Inserta detalles de cambio de llantas
    [result] = await connection.execute('INSERT INTO DetalleCambioLlantas (Mantenimiento_ID, Llanta, Cantidad) VALUES (?, ?, ?)', [mantenimientoID, 'Delantero Derecho', 1]);
    console.log('Detalle de cambio de llantas agregado');

    // Inserta una observación
    [result] = await connection.execute('INSERT INTO Observaciones (Camioneta_ID, Fecha, Tipo_Observacion, Ubicacion, Descripcion) VALUES (?, NOW(), ?, ?, ?)', [camionetaID, 'Rayón', 'Puerta Trasera', 'Rayón en la puerta trasera derecha']);
    console.log('Observación agregada');

  } catch (err) {
    console.error('Error en la ejecución del test:', err);
  } finally {
    if (connection) {
      // Cierra la conexión a la base de datos
      await connection.end();
    }
  }
}

runTest();
