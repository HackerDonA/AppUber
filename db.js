const mysql = require('mysql2/promise'); // Usa mysql2 con promesas

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',  // Reemplaza con la nueva contraseña
  database: 'Uber',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const query = async (sql, params = []) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  query,
  pool
};
