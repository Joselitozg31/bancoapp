// Importar funciones necesarias
import { contractCard } from '@/lib/cards';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud POST para contratar una tarjeta
export async function POST(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener los datos de la tarjeta del cuerpo de la solicitud
    const cardData = await request.json();

    // Verificar que todos los campos requeridos estén presentes
    if (!cardData.card_number || !cardData.card_type || !cardData.expiration_date || !cardData.hiring_date || !cardData.ccv || !cardData.account_iban) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Asignar el número de documento del usuario a los datos de la tarjeta
    cardData.user_document_number = user.id;

    // Contratar la tarjeta
    const newCard = await contractCard(cardData);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Tarjeta creada exitosamente', card: newCard });
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}