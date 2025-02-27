//Modelo accounts.js
import pool from './database';
// Funcion de para contratar una cuenta
// Toma como parametros los datos del formulario de contratacion de cuenta
export async function contractAccount(accountData) {
  const {
    iban,
    account_type,
    currency,
    total_balance,
    available_balance,
    held_balance,
    opening_date,
  } = accountData;
  // Consulta parametrizada para insertar los datos de la cuenta en la base de datos
  const [result] = await pool.query(
    `INSERT INTO accounts (
      iban, account_type, total_balance, available_balance, held_balance, opening_date
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      iban,
      account_type,
      currency,
      total_balance,
      available_balance,
      held_balance,
      opening_date,
    ]
  );
  return result.insertId;
}
// Funcion para listar las cuentas de un usuario
export async function listAccount(document_number) {
  // Consulta parametrizada para obtener las cuentas de un usuario
  const [rows] = await pool.query('SELECT * FROM accounts WHERE document_number = ?', [document_number]);

  if (rows.length === 0) {
    throw new Error('Cuentas no encontradas');
  }

  return rows;
}