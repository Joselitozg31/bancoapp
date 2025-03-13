import { NextResponse } from 'next/server';
import { getAccountDetailsByIban, getAccountTransactions } from '@/lib/accounts';

export async function GET(request) {
  try {
    // Obtener los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const iban = searchParams.get('iban');
    const document_number = request.headers.get('user_document_number');

    // Verificar si el número de documento del usuario está presente
    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener los detalles de la cuenta usando el IBAN
    const accountDetails = await getAccountDetailsByIban(iban);

    // Obtener el historial de transacciones de la cuenta usando el IBAN
    const transactions = await getAccountTransactions(iban);

    // Devolver los detalles de la cuenta y las transacciones en la respuesta
    return NextResponse.json({ accountDetails, transactions });
  } catch (error) {
    // Manejar errores y devolver un mensaje de error en la respuesta
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}