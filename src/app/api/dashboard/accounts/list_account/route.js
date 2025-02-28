// Importar funciones necesarias
import { listAccounts } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud GET para listar las cuentas
export async function GET(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener las cuentas del usuario
    const accounts = await listAccounts(user.id);

    // Devolver las cuentas en la respuesta
    return NextResponse.json(accounts);
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}