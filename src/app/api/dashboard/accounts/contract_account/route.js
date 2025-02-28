// Importar funciones necesarias
import { contractAccount } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Función para manejar la solicitud POST para contratar una cuenta
export async function POST(request) {
  try {
    // Verificar el token del usuario
    const user = verifyToken(request);

    // Obtener los datos de la cuenta del cuerpo de la solicitud
    const accountData = await request.json();

    // Verificar que todos los campos requeridos estén presentes
    if (!accountData.iban || !accountData.account_type || !accountData.currency) {
      return NextResponse.json({ message: 'IBAN, tipo de cuenta y moneda son requeridos' }, { status: 400 });
    }

    // Asignar el número de documento del usuario a los datos de la cuenta
    accountData.user_document_number = user.id;

    // Contratar la cuenta
    const newAccount = await contractAccount(accountData);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Cuenta creada exitosamente', account: newAccount });
  } catch (error) {
    // Manejar errores y devolver una respuesta de error
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}