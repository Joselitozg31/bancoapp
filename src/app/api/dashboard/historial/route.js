import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/historial';

export async function GET(request) {
  try {
    // Obtener el número de documento del usuario desde los encabezados de la solicitud
    const document_number = request.headers.get('document_number');

    // Verificar si el número de documento del usuario está presente
    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener el historial de transacciones usando el número de documento del usuario
    const transactions = await getTransactions(document_number);

    // Devolver el historial de transacciones en la respuesta
    return NextResponse.json(transactions);
  } catch (error) {
    // Manejar errores y devolver un mensaje de error en la respuesta
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}