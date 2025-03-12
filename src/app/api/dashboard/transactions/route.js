import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/transactions';

export async function GET(request) {
  try {
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener el historial de transacciones
    const transactions = await getTransactions(document_number);

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}