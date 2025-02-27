import pool from './database';

// Función para obtener los seguros contratados por un usuario
export async function getContractedInsurances(userDocumentNumber, accountIban) {
  try {
    const [rows] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );
    return rows.map(row => row.insurance_id); // Devolver una lista de IDs de seguros contratados
  } catch (error) {
    throw new Error('Error al obtener los seguros contratados: ' + error.message); // Lanzar un error si ocurre una excepción
  }
}

// Función para contratar seguros
export async function contratarSeguros(selectedInsurances, userDocumentNumber, accountIban) {
  const insurancesToAdd = [];
  const hiringDate = new Date().toISOString().split('T')[0]; // Fecha actual
  const expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]; // Un año después

  // Añadir seguros seleccionados a la lista de seguros a contratar
  if (selectedInsurances.medico) insurancesToAdd.push([userDocumentNumber, accountIban, 1, hiringDate, expirationDate]);
  if (selectedInsurances.coche) insurancesToAdd.push([userDocumentNumber, accountIban, 2, hiringDate, expirationDate]);
  if (selectedInsurances.animal) insurancesToAdd.push([userDocumentNumber, accountIban, 3, hiringDate, expirationDate]);

  try {
    // Verificar si el usuario existe
    const [user] = await pool.query('SELECT * FROM users WHERE document_number = ?', [userDocumentNumber]);
    if (user.length === 0) {
      throw new Error('El usuario no existe'); // Lanzar un error si el usuario no existe
    }

    // Obtener los seguros ya contratados por el usuario
    const [existingInsurances] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );

    const existingInsuranceIds = existingInsurances.map((insurance) => insurance.insurance_id); // Obtener IDs de seguros ya contratados

    // Filtrar los nuevos seguros que no están ya contratados
    const newInsurances = insurancesToAdd.filter((insurance) => !existingInsuranceIds.includes(insurance[2]));

    if (newInsurances.length === 0) {
      throw new Error('Ya tienes los seguros seleccionados contratados'); // Lanzar un error si todos los seguros seleccionados ya están contratados
    }

    // Insertar los nuevos seguros en la base de datos
    await pool.query('INSERT INTO user_account_insurances (user_document_number, account_iban, insurance_id, hiring_date, expiration_date) VALUES ?', [newInsurances]);

    return { message: 'Seguros contratados con éxito' }; // Devolver un mensaje de éxito
  } catch (error) {
    throw new Error(error.message); // Lanzar un error si ocurre una excepción
  }
}

// Función para dar de baja seguros
export async function darDeBajaSeguros(selectedInsurances, userDocumentNumber, accountIban) {
  const insurancesToRemove = [];
  if (selectedInsurances.medico) insurancesToRemove.push(1); // Añadir seguro médico a la lista de seguros a dar de baja
  if (selectedInsurances.coche) insurancesToRemove.push(2); // Añadir seguro de coche a la lista de seguros a dar de baja
  if (selectedInsurances.animal) insurancesToRemove.push(3); // Añadir seguro de animal a la lista de seguros a dar de baja

  try {
    // Verificar si el usuario existe
    const [user] = await pool.query('SELECT * FROM users WHERE document_number = ?', [userDocumentNumber]);
    if (user.length === 0) {
      throw new Error('El usuario no existe'); // Lanzar un error si el usuario no existe
    }

    // Obtener los seguros ya contratados por el usuario
    const [existingInsurances] = await pool.query(
      'SELECT insurance_id FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ?',
      [userDocumentNumber, accountIban]
    );

    const existingInsuranceIds = existingInsurances.map((insurance) => insurance.insurance_id); // Obtener IDs de seguros ya contratados

    // Filtrar los seguros que no están contratados
    const insurancesNotOwned = insurancesToRemove.filter((insuranceId) => !existingInsuranceIds.includes(insuranceId));

    if (insurancesNotOwned.length > 0) {
      throw new Error('Has seleccionado algun seguro que ya esta dado de baja'); // Lanzar un error si algún seguro seleccionado ya está dado de baja
    }

    // Eliminar los seguros seleccionados de la base de datos
    await pool.query('DELETE FROM user_account_insurances WHERE user_document_number = ? AND account_iban = ? AND insurance_id IN (?)', [userDocumentNumber, accountIban, insurancesToRemove]);

    return { message: 'Seguros dados de baja con éxito' }; // Devolver un mensaje de éxito
  } catch (error) {
    throw new Error(error.message); // Lanzar un error si ocurre una excepción
  }
}