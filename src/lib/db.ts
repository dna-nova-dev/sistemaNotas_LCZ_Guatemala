import mysql from 'mysql2/promise';

const requiredEnvVar = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const parseNumberEnv = (name: string, fallback: number): number => {
  const value = process.env[name];

  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number provided for environment variable ${name}`);
  }

  return parsed;
};

// Configuración de la conexión
export const pool = mysql.createPool({
  host: requiredEnvVar('DB_HOST'),
  port: parseNumberEnv('DB_PORT', 3306),
  user: requiredEnvVar('DB_USER'),
  password: requiredEnvVar('DB_PASSWORD'),
  database: requiredEnvVar('DB_NAME'),
  waitForConnections: true,
  connectionLimit: parseNumberEnv('DB_CONNECTION_LIMIT', 10),
});

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
