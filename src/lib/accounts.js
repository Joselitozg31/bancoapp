import pool from './database';

export async function listAccounts(user_document_id) {
  try {
    const query = `
      SELECT accounts.* 
      FROM accounts
      INNER JOIN user_accounts ON accounts.iban = user_accounts.account_iban
      WHERE user_accounts.user_document_number = ?
    `;
    
    const [rows] = await pool.query(query, [user_document_id]);
    
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  } catch (error) {
    console.error('Error al listar cuentas:', error);
    throw new Error('Error al obtener las cuentas del usuario');
  }
}

export async function contractAccount(accountData) {
  try {
    const {
      account_type,
      currency,
      user_document_number
    } = accountData;

    // Generar IBAN aleatorio
    const iban = generateIBAN();

    // Insertar la cuenta en la base de datos
    const [result] = await pool.query(
      `INSERT INTO accounts (
        iban, account_type, currency, total_balance, available_balance, held_balance, opening_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        iban,
        account_type,
        currency,
        0, // balance inicial
        0, // balance disponible inicial
        0, // balance retenido inicial
        new Date().toISOString().split('T')[0] // fecha actual
      ]
    );
    if (result.affectedRows === 0) {
      throw new Error('Error al crear la cuenta');
    }

    // Vincular la cuenta con el usuario
    await pool.query(
      'INSERT INTO user_accounts (user_document_number, account_iban) VALUES (?, ?)',
      [user_document_number, iban]
    );

    return { iban };
  } catch (error) {
    console.error('Error al contratar cuenta:', error);
    throw new Error('Error al crear la cuenta');
  }
}

// Función auxiliar para generar IBAN
function generateIBAN() {
  const countryCode = 'ES';
  const bankCode = '2100';
  const accountNumber = Math.random().toString().slice(2, 12);
  return `${countryCode}${bankCode}${accountNumber}`;
}

export async function deleteAccount(iban) {
  try {
    const [result] = await pool.query('DELETE FROM accounts WHERE iban = ?', [iban]);

    if (result.affectedRows === 0) {
      throw new Error('Cuenta no encontrada');
    }

    return result.affectedRows;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    throw new Error('Error al eliminar la cuenta');
  }
}