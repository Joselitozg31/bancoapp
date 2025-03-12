import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const iban = searchParams.get('iban');
    const document_number = request.headers.get('user_document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener los detalles de la cuenta
    const accountDetails = await query(
      'SELECT * FROM accounts WHERE iban = ?',
      [iban]
    );

    // Obtener el historial de transacciones de la cuenta
    const transactions = await query(
      'SELECT * FROM transfers WHERE origin_account_iban = ? OR destination_account_iban = ?',
      [iban, iban]
    );

    return NextResponse.json({ accountDetails: accountDetails[0], transactions });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}