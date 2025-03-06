import { query } from '@/lib/database';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const iban = searchParams.get('iban');

  if (!iban) {
    return new Response(JSON.stringify({ error: 'IBAN is required' }), { status: 400 });
  }

  try {
    const account = await query(`
      SELECT iban, currency
      FROM accounts
      WHERE iban = ?
    `, [iban]);

    if (account.length === 0) {
      return new Response(JSON.stringify({ error: 'Account not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(account[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching account' }), { status: 500 });
  }
}