import bcrypt from 'bcryptjs';
import pool from '@/lib/database';
import { updatePasswordQuery } from '@/lib/queries';

export const POST = async (req, res) => {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return new Response(JSON.stringify({ message: 'Email and new password are required' }), { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await connection.query(updatePasswordQuery, [hashedPassword, email]);
    connection.release();

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating password', error: error.message }), { status: 500 });
  }
};