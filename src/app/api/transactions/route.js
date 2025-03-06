import { query } from '@/lib/database';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_document_number = searchParams.get('user_document_number');

  if (!user_document_number) {
    return new Response(JSON.stringify({ error: 'User document number is required' }), { status: 400 });
  }

  try {
    const transactions = await query(`
      SELECT transaction_id, account_iban, amount, transaction_type, transaction_date, concept
      FROM transactions
      WHERE user_document_number = ?
      ORDER BY transaction_date DESC
    `, [user_document_number]);

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching transactions' }), { status: 500 });
  }
}