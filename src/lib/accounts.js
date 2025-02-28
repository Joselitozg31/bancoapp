import pool from './database';

// Función para contratar una cuenta
export async function contractAccount(accountData) {
  const {
    iban,
    account_type,
    currency,
    total_balance,
    available_balance,
    held_balance,
    opening_date,
    user_document_number,
  } = accountData;

  const [result] = await pool.query(
    `INSERT INTO accounts (
      iban, account_type, currency, total_balance, available_balance, held_balance, opening_date, user_document_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      iban,
      account_type,
      currency,
      total_balance,
      available_balance,
      held_balance,
      opening_date,
      user_document_number,
    ]
  );

  return result.insertId;
}

// Función para listar las cuentas de un usuario
export async function listAccounts(user_document_number) {
  const [rows] = await pool.query('SELECT * FROM accounts WHERE user_document_number = ?', [user_document_number]);

  if (rows.length === 0) {
    throw new Error('Cuentas no encontradas');
  }

  return rows;
}

// Función para eliminar una cuenta
export async function deleteAccount(iban) {
  const [result] = await pool.query('DELETE FROM accounts WHERE iban = ?', [iban]);

  if (result.affectedRows === 0) {
    throw new Error('Cuenta no encontrada');
  }

  return result.affectedRows;
}