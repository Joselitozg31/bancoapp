// Importar funciones necesarias
import { deleteAccount } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud DELETE para eliminar una cuenta
export async function DELETE(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener el IBAN de los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const iban = searchParams.get('iban');
    
    // Verificar que el IBAN esté presente
    if (!iban) {
      return NextResponse.json({ message: 'IBAN requerido' }, { status: 400 });
    }

    // Eliminar la cuenta
    await deleteAccount(iban);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}