import pool from './database';

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

export async function listAccount(document_number) {
  const [rows] = await pool.query('SELECT * FROM accounts WHERE document_number = ?', [document_number]);

  if (rows.length === 0) {
    throw new Error('Cuentas no encontradas');
  }

  return rows;
}