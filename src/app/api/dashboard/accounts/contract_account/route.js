import { contractAccount } from '@/lib/accounts';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Obtener el document_number desde los headers
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Obtener los datos de la cuenta del cuerpo de la solicitud
    const accountData = await request.json();

    // Verificar que todos los campos requeridos estén presentes
    if (!accountData.account_type || !accountData.currency) {
      return NextResponse.json({ message: 'Tipo de cuenta y moneda son requeridos' }, { status: 400 });
    }

    // Asignar el número de documento del usuario a los datos de la cuenta
    accountData.user_document_number = document_number;

    // Contratar la cuenta
    const newAccount = await contractAccount(accountData);

    // Devolver una respuesta exitosa
    return NextResponse.json({ message: 'Cuenta creada exitosamente', account: newAccount });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}