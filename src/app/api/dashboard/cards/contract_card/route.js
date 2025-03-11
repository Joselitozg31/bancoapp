import { contractCard } from '@/lib/cards';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Obtener el document_number desde los headers
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener los datos de la tarjeta del cuerpo de la solicitud
    const cardData = await request.json();

    // Verificar que todos los campos requeridos estén presentes
    if (!cardData.card_type || !cardData.account_iban) {
      return NextResponse.json({ message: 'Tipo de tarjeta y cuenta asociada son requeridos' }, { status: 400 });
    }

    // Generar datos automáticos de la tarjeta
    const newCardData = {
      ...cardData,
      card_number: generateCardNumber(),
      expiration_date: generateExpirationDate(),
      hiring_date: new Date().toISOString().split('T')[0],
      ccv: generateCCV(),
      user_document_number: document_number
    };

    // Contratar la tarjeta
    const newCard = await contractCard(newCardData);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Tarjeta creada exitosamente', card: newCard });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// Funciones auxiliares para generar datos de tarjeta
function generateCardNumber() {
  return Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
}

function generateExpirationDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  return date.toISOString().split('T')[0];
}

function generateCCV() {
  return Math.floor(Math.random() * 900) + 100;
}