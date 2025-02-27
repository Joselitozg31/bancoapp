import pool from './database';

export async function getContractedInsurances(userDocumentNumber, accountIban) {
  try {
    const [rows] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );
    return rows.map(row => row.insurance_id);
  } catch (error) {
    throw new Error('Error al obtener los seguros contratados: ' + error.message);
  }
}

export async function contratarSeguros(selectedInsurances, userDocumentNumber, accountIban) {
  const insurancesToAdd = [];
  const hiringDate = new Date().toISOString().split('T')[0]; // Fecha actual
  const expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]; // Un año después

  if (selectedInsurances.medico) insurancesToAdd.push([userDocumentNumber, accountIban, 1, hiringDate, expirationDate]);
  if (selectedInsurances.coche) insurancesToAdd.push([userDocumentNumber, accountIban, 2, hiringDate, expirationDate]);
  if (selectedInsurances.animal) insurancesToAdd.push([userDocumentNumber, accountIban, 3, hiringDate, expirationDate]);

  try {
    // Verificar si el usuario existe
    const [user] = await pool.query('SELECT * FROM users WHERE document_number = ?', [userDocumentNumber]);
    if (user.length === 0) {
      throw new Error('El usuario no existe');
    }

    const [existingInsurances] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );

    const existingInsuranceIds = existingInsurances.map((insurance) => insurance.insurance_id);

    const newInsurances = insurancesToAdd.filter((insurance) => !existingInsuranceIds.includes(insurance[2]));

    if (newInsurances.length === 0) {
      throw new Error('Ya tienes los seguros seleccionados contratados');
    }

    await pool.query('INSERT INTO user_account_insurances (user_document_number, account_iban, insurance_id, hiring_date, expiration_date) VALUES ?', [newInsurances]);

    return { message: 'Seguros contratados con éxito' };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function darDeBajaSeguros(selectedInsurances, userDocumentNumber, accountIban) {
  const insurancesToRemove = [];
  if (selectedInsurances.medico) insurancesToRemove.push(1);
  if (selectedInsurances.coche) insurancesToRemove.push(2);
  if (selectedInsurances.animal) insurancesToRemove.push(3);

  try {
    // Verificar si el usuario existe
    const [user] = await pool.query('SELECT * FROM users WHERE document_number = ?', [userDocumentNumber]);
    if (user.length === 0) {
      throw new Error('El usuario no existe');
    }

    const [existingInsurances] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );

    const existingInsuranceIds = existingInsurances.map((insurance) => insurance.insurance_id);

    const insurancesNotOwned = insurancesToRemove.filter((insuranceId) => !existingInsuranceIds.includes(insuranceId));

    if (insurancesNotOwned.length > 0) {
      throw new Error('Has seleccionado algun seguro que ya esta dado de baja');
    }

    await pool.query('DELETE FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ? AND insurance_id IN (?)', [userDocumentNumber, accountIban, insurancesToRemove]);

    return { message: 'Seguros dados de baja con éxito' };
  } catch (error) {
    throw new Error(error.message);
  }
}