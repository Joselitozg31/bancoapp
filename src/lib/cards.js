import pool from './database';

export async function listCards(user_document_id) {
  try {
    const query = `
      SELECT cards.* 
      FROM cards
      WHERE cards.user_document_number = ?
    `;
    
    const [rows] = await pool.query(query, [user_document_id]);
    
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  } catch (error) {
    console.error('Error al listar tarjetas:', error);
    throw new Error('Error al obtener las tarjetas del usuario');
  }
}

export async function contractCard(cardData) {
  try {
    const {
      card_number,
      card_type,
      expiration_date,
      hiring_date,
      ccv,
      account_iban,
      user_document_number
    } = cardData;

    // Insertar la tarjeta en la base de datos
    const [result] = await pool.query(
      `INSERT INTO cards (
        card_number, card_type, expiration_date, hiring_date, 
        ccv, account_iban, user_document_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        card_number,
        card_type,
        expiration_date,
        hiring_date,
        ccv,
        account_iban,
        user_document_number
      ]
    );

    // Verificar que la inserción fue exitosa
    if (result.affectedRows === 0) {
      throw new Error('Error al crear la tarjeta');
    }

    return { 
      card_number,
      card_type,
      expiration_date,
      hiring_date,
      account_iban 
    };
  } catch (error) {
    console.error('Error al contratar tarjeta:', error);
    throw new Error('Error al crear la tarjeta');
  }
}

export async function deleteCard(card_number) {
  try {
    const [result] = await pool.query('DELETE FROM cards WHERE card_number = ?', [card_number]);

    if (result.affectedRows === 0) {
      throw new Error('Tarjeta no encontrada');
    }

    return result.affectedRows;
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error);
    throw new Error('Error al eliminar la tarjeta');
  }
}