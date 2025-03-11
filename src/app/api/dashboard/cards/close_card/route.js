import { verifyCardOwnership, deleteCard } from '@/lib/cards';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cardNumber, documentNumber } = await request.json();

    if (!cardNumber || !documentNumber) {
      return NextResponse.json(
        { message: 'Número de tarjeta y documento requeridos' }, 
        { status: 400 }
      );
    }

    const card = await verifyCardOwnership(cardNumber, documentNumber);
    
    if (!card) {
      return NextResponse.json(
        { message: 'La tarjeta no existe o no pertenece al usuario' },
        { status: 404 }
      );
    }

    await deleteCard(cardNumber, documentNumber);
    
    return NextResponse.json({ message: 'Tarjeta eliminada correctamente' });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { message: 'Error al eliminar la tarjeta' }, 
      { status: 500 }
    );
  }
}