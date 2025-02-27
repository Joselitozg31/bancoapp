import bcrypt from 'bcryptjs';
import pool from '@/lib/database';
import { updatePasswordQuery } from '@/lib/queries';

export const POST = async (req, res) => {
  const { email, newPassword } = await req.json(); // Extraer email y nueva contraseña del cuerpo de la solicitud

  if (!email || !newPassword) {
    return new Response(JSON.stringify({ message: 'Email and new password are required' }), { status: 400 }); // Validar que el email y la nueva contraseña estén presentes
  }

  try {
    const connection = await pool.getConnection(); // Obtener una conexión a la base de datos

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hashear la nueva contraseña

    // Update the password in the database
    await connection.query(updatePasswordQuery, [hashedPassword, email]); // Actualizar la contraseña en la base de datos
    connection.release(); // Liberar la conexión

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 }); // Devolver una respuesta exitosa
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating password', error: error.message }), { status: 500 }); // Devolver un mensaje de error si ocurre una excepción
  }
};