// Importar funciones necesarias
import { listCards } from '@/lib/cards';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud GET para listar las tarjetas
export async function GET(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener las tarjetas del usuario
    const cards = await listCards(user.id);

    // Devolver las tarjetas en la respuesta
    return NextResponse.json(cards);
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}