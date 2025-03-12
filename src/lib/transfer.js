import pool from './database';

export async function transferFunds({ originIban, destinationIban, amount, concept }) {
  const connection = await pool.getConnection();
  try {
    // Iniciar una transacción
    await connection.beginTransaction();

    // Actualizar el balance disponible de la cuenta de origen
    await connection.query(
      `UPDATE accounts SET available_balance = available_balance - ${amount} WHERE iban = '${originIban}'`
    );

    // Actualizar el balance disponible de la cuenta de destino
    await connection.query(
      `UPDATE accounts SET available_balance = available_balance + ${amount} WHERE iban = '${destinationIban}'`
    );

    // Registrar la transferencia
    const result = await connection.query(
      `INSERT INTO transfers (origin_account_iban, destination_account_iban, amount, transfer_date, concept) VALUES ('${originIban}', '${destinationIban}', ${amount}, NOW(), '${concept}')`
    );

    // Confirmar la transacción
    await connection.commit();

    return result;
  } catch (error) {
    // Revertir la transacción en caso de error
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}