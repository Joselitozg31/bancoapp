import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request) {
  try {
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener el historial de transacciones
    const transactions = await query(
      `SELECT * FROM transfers 
       WHERE origin_account_iban IN (SELECT account_iban FROM user_accounts WHERE user_document_number = ?) 
       OR destination_account_iban IN (SELECT account_iban FROM user_accounts WHERE user_document_number = ?)`,
      [document_number, document_number]
    );

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}