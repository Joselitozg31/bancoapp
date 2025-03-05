import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/database';

export async function POST(req, res) {
  const { password, document_number } = await req.json();

  if (!password || !document_number) {
    return new Response(JSON.stringify({ message: 'Password and document number are required' }), { status: 400 });
  }

  console.log('Received password:', password);
  console.log('Received document_number:', document_number);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('Updating password for document_number:', document_number);
    const result = await query('UPDATE users SET password = ? WHERE document_number = ?', [hashedPassword, document_number]);
    console.log('Update result:', result);
    return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return new Response(JSON.stringify({ message: 'Error updating password' }), { status: 500 });
  }
}