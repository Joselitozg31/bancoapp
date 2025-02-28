// Importar funciones necesarias
import { closeCard } from '@/lib/cards';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud DELETE para eliminar una tarjeta
export async function DELETE(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener el número de tarjeta de los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const card_number = searchParams.get('card_number');
    
    // Verificar que el número de tarjeta esté presente
    if (!card_number) {
      return NextResponse.json({ message: 'Número de tarjeta requerido' }, { status: 400 });
    }

    // Eliminar la tarjeta
    await closeCard(card_number);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}