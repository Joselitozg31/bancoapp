import bcrypt from 'bcryptjs';
import pool from '@/lib/database';

export async function POST(req) {
  try {
    const { password, document_number } = await req.json();
    console.log('Received data:', { password, document_number }); // Log para verificar los datos recibidos

    if (!password || !document_number) {
      return new Response(JSON.stringify({ error: 'Password and document number are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Cifrar la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword); // Log para verificar la contraseña cifrada

    // Actualizar la contraseña en la base de datos
    const [result] = await pool.query('UPDATE users SET password = ? WHERE document_number = ?', [hashedPassword, document_number]);
    console.log('Update result:', result); // Log para verificar el resultado de la actualización

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating password:', error); // Log para verificar cualquier error en la actualización
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}