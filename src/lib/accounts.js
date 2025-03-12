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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verificar que la cuenta pertenece al usuario usando user_accounts
    const [account] = await connection.query(
      `SELECT accounts.* 
       FROM accounts 
       INNER JOIN user_accounts ON accounts.iban = user_accounts.account_iban 
       WHERE accounts.iban = ? AND user_accounts.user_document_number = ?`,
      [iban, documentNumber]
    );

    if (account.length === 0) {
      throw new Error('La cuenta no existe o no pertenece al usuario');
    }

    // Eliminar seguros relacionados con la cuenta
    await connection.query(
      'DELETE FROM user_account_insurances WHERE account_iban = ?',
      [iban]
    );

    // Eliminar transacciones relacionadas
    await connection.query(
      'DELETE FROM transactions WHERE account_iban = ?',
      [iban]
    );

    // Eliminar transferencias relacionadas como origen
    await connection.query(
      'DELETE FROM transfers WHERE origin_account_iban = ?',
      [iban]
    );

    // Eliminar transferencias relacionadas como destino
    await connection.query(
      'DELETE FROM transfers WHERE destination_account_iban = ?',
      [iban]
    );

    // Eliminar tarjetas asociadas a la cuenta
    await connection.query(
      'DELETE FROM cards WHERE account_iban = ?',
      [iban]
    );

    // Eliminar la relación usuario-cuenta
    await connection.query(
      'DELETE FROM user_accounts WHERE account_iban = ?',
      [iban]
    );

    // Finalmente, eliminar la cuenta
    await connection.query(
      'DELETE FROM accounts WHERE iban = ?',
      [iban]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw new Error('Error al eliminar la cuenta: ' + error.message);
  } finally {
    connection.release();
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

export async function addMoney(iban, amount) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Primero obtener el user_document_number asociado a la cuenta
    const [userAccount] = await connection.query(
      'SELECT user_document_number FROM user_accounts WHERE account_iban = ?',
      [iban]
    );

    if (userAccount.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    // Actualizar el saldo de la cuenta
    const [result] = await connection.query(
      'UPDATE accounts SET available_balance = available_balance + ? WHERE iban = ?',
      [amount, iban]
    );

    if (result.affectedRows === 0) {
      throw new Error('Cuenta no encontrada');
    }

    // Registrar la transacción incluyendo el user_document_number
    await connection.query(
      'INSERT INTO transactions (account_iban, user_document_number, amount, concept, transaction_type, transaction_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [iban, userAccount[0].user_document_number, amount, 'Depósito de dinero', 'income']
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function withdrawMoney(iban, amount) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Primero obtener el user_document_number asociado a la cuenta
    const [userAccount] = await connection.query(
      'SELECT user_document_number FROM user_accounts WHERE account_iban = ?',
      [iban]
    );

    if (userAccount.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    // Verificar saldo disponible
    const [account] = await connection.query(
      'SELECT available_balance FROM accounts WHERE iban = ?',
      [iban]
    );

    if (account.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    if (account[0].available_balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // Actualizar el saldo de la cuenta
    await connection.query(
      'UPDATE accounts SET available_balance = available_balance - ? WHERE iban = ?',
      [amount, iban]
    );

    // Registrar la transacción incluyendo el user_document_number
    await connection.query(
      'INSERT INTO transactions (account_iban, user_document_number, amount, concept, transaction_type, transaction_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [iban, userAccount[0].user_document_number, amount, 'Retiro de dinero', 'expense']
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function holdMoney(iban, amount) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Primero obtener el user_document_number asociado a la cuenta
    const [userAccount] = await connection.query(
      'SELECT user_document_number FROM user_accounts WHERE account_iban = ?',
      [iban]
    );

    if (userAccount.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    // Verificar saldo disponible
    const [account] = await connection.query(
      'SELECT available_balance FROM accounts WHERE iban = ?',
      [iban]
    );

    if (account.length === 0) {
      throw new Error('Cuenta no encontrada');
    }

    if (account[0].available_balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // Actualizar el saldo de la cuenta
    await connection.query(
      'UPDATE accounts SET available_balance = available_balance - ?, held_balance = held_balance + ? WHERE iban = ?',
      [amount, amount, iban]
    );

    // Registrar la transacción incluyendo el user_document_number
    await connection.query(
      'INSERT INTO transactions (account_iban, user_document_number, amount, concept, transaction_type, transaction_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [iban, userAccount[0].user_document_number, amount, 'Retención de dinero', 'held']
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}