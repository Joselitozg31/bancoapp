import { listAccounts } from '@/lib/accounts';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Obtener el document_number desde los headers
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Documento no proporcionado' }, { status: 401 });
    }

    // Obtener las cuentas del usuario usando el document_number
    const accounts = await listAccounts(document_number);

    // Devolver las cuentas en la respuesta
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}