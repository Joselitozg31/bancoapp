import { NextResponse } from 'next/server';
import { getAccountDetailsByIban, getAccountTransactions } from '@/lib/accounts';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const iban = searchParams.get('iban');
    const document_number = request.headers.get('user_document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener los detalles de la cuenta
    const accountDetails = await getAccountDetailsByIban(iban);

    // Obtener el historial de transacciones de la cuenta
    const transactions = await getAccountTransactions(iban);

    return NextResponse.json({ accountDetails, transactions });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}