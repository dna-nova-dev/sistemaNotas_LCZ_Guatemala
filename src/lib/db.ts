import mysql from 'mysql2/promise';

// Configuración de la conexión
export const pool = mysql.createPool({
  export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});,

export async function ejecutarSP(spNombre: string, params: any[] = []) {
  const placeholders = params.map(() => '?').join(',');
  const sql = `CALL ${spNombre}(${placeholders})`;
  
  try {
    const [rows]: any = await pool.execute(sql, params);
    return rows[0]; // Retorna los datos que devuelve el SP
  } catch (error) {
    console.error(`Error en SP ${spNombre}:`, error);
    throw error;
  }
}
