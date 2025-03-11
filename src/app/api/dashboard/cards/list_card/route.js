import { listCards } from '@/lib/cards';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Obtener el document_number desde los headers
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Documento no proporcionado' }, { status: 401 });
    }

    // Obtener las tarjetas del usuario
    const cards = await listCards(document_number);

    // Devolver las tarjetas en la respuesta
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}