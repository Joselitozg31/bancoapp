import bcrypt from 'bcryptjs';
import { query } from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { password, document_number } = req.body;

  if (!password || !document_number) {
    return res.status(400).json({ message: 'Password and document number are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('Updating password for document_number:', document_number);
    const result = await query('UPDATE users SET password = ? WHERE document_number = ?', [hashedPassword, document_number]);
    console.log('Update result:', result);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
}