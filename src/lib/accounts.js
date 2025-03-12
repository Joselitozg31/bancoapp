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
      currency, // Make sure this is being passed from the form
      user_document_number
    } = accountData;

    const iban = generateIBAN();

    const [result] = await pool.query(
      `INSERT INTO accounts (
        iban, account_type, currency, total_balance, available_balance, held_balance, opening_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        iban,
        account_type,
        currency, // Make sure this value is being used here
        0,
        0,
        0,
        new Date().toISOString().split('T')[0]
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

export async function deleteAccount(iban, documentNumber) {
  try {
    // Primero verificamos si hay tarjetas asociadas
    const [cards] = await pool.query(
      'SELECT * FROM cards WHERE account_iban = ?',
      [iban]
    );

    if (cards && cards.length > 0) {
      throw new Error('No se puede eliminar la cuenta porque tiene tarjetas asociadas');
    }

    // Comenzar transacción
    await pool.query('START TRANSACTION');

    try {
      // Primero eliminar la relación en user_accounts
      const [userAccountResult] = await pool.query(
        'DELETE FROM user_accounts WHERE account_iban = ? AND user_document_number = ?',
        [iban, documentNumber]
      );

      if (userAccountResult.affectedRows === 0) {
        throw new Error('Error al eliminar la relación usuario-cuenta');
      }

      // Después eliminar la cuenta
      const [accountResult] = await pool.query(
        'DELETE FROM accounts WHERE iban = ?',
        [iban]
      );

      if (accountResult.affectedRows === 0) {
        throw new Error('Error al eliminar la cuenta');
      }

      // Confirmar transacción
      await pool.query('COMMIT');
      return true;
    } catch (error) {
      // Si hay error, revertir cambios
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    throw new Error(error.message || 'Error al eliminar la cuenta');
  }
}

export async function verifyAccountOwnership(iban, documentNumber) {
  try {
    const [rows] = await pool.query(
      `SELECT a.* 
       FROM accounts a
       INNER JOIN user_accounts ua ON a.iban = ua.account_iban
       WHERE a.iban = ? AND ua.user_document_number = ?`,
      [iban, documentNumber]
    );
    
    if (!rows || rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error('Error al verificar cuenta:', error);
    throw new Error('Error al verificar la propiedad de la cuenta');
  }
}

// Ejemplo de implementación de la función getAccountDetails
export async function getAccountDetails(iban, userDocumentNumber) {
  // Implementa la lógica para obtener los detalles de la cuenta
  // Esto puede incluir una consulta a la base de datos
  // Aquí hay un ejemplo ficticio:
  const accountDetails = {
    iban: iban,
    account_type: 'Cuenta Corriente',
    currency: 'EUR',
    total_balance: 1000,
    available_balance: 800,
    held_balance: 200,
    opening_date: '2022-01-01',
  };

  return accountDetails;
}

export async function getAccountDetailsByIban(iban) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM accounts WHERE iban = ?',
      [iban]
    );
    return rows[0];
  } catch (error) {
    console.error('Error al obtener detalles de la cuenta:', error);
    throw new Error('Error al obtener detalles de la cuenta');
  }
}

export async function getAccountTransactions(iban) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transfers WHERE origin_account_iban = ? OR destination_account_iban = ?',
      [iban, iban]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener transacciones de la cuenta:', error);
    throw new Error('Error al obtener transacciones de la cuenta');
  }
}