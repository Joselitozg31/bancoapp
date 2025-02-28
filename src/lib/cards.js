// Importar el módulo de la base de datos
import pool from './database';

// Función para contratar una tarjeta
export async function contractCard(cardData) {
  const {
    card_number,
    card_type,
    expiration_date,
    hiring_date,
    ccv,
    account_iban,
    user_document_number,
  } = cardData;

  // Insertar la tarjeta en la base de datos
  const [result] = await pool.query(
    `INSERT INTO cards (
      card_number, card_type, expiration_date, hiring_date, ccv, account_iban, user_document_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      card_number,
      card_type,
      expiration_date,
      hiring_date,
      ccv,
      account_iban,
      user_document_number,
    ]
  );

  // Devolver el ID de la nueva tarjeta
  return result.insertId;
}

// Función para listar las tarjetas de un usuario
export async function listCards(user_document_number) {
  // Obtener las tarjetas del usuario desde la base de datos
  const [rows] = await pool.query('SELECT * FROM cards WHERE user_document_number = ?', [user_document_number]);

  // Verificar si se encontraron tarjetas
  if (rows.length === 0) {
    throw new Error('Tarjetas no encontradas');
  }

  // Devolver las tarjetas
  return rows;
}

// Función para eliminar una tarjeta
export async function closeCard(card_number) {
  // Eliminar la tarjeta de la base de datos
  const [result] = await pool.query('DELETE FROM cards WHERE card_number = ?', [card_number]);

  // Verificar si se eliminó alguna tarjeta
  if (result.affectedRows === 0) {
    throw new Error('Tarjeta no encontrada');
  }

  // Devolver el número de filas afectadas
  return result.affectedRows;
}