import { verifyAccountOwnership, deleteAccount } from '@/lib/accounts';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { iban, documentNumber } = await request.json();

    if (!iban || !documentNumber) {
      return NextResponse.json(
        { message: 'IBAN y documento requeridos' }, 
        { status: 400 }
      );
    }

    const account = await verifyAccountOwnership(iban, documentNumber);
    
    if (!account) {
      return NextResponse.json(
        { message: 'La cuenta no existe o no pertenece al usuario' },
        { status: 404 }
      );
    }

    if (account.total_balance > 0) {
      return NextResponse.json(
        { message: 'No se puede cerrar una cuenta con saldo positivo' },
        { status: 400 }
      );
    }

    await deleteAccount(iban, documentNumber);
    
    return NextResponse.json({ message: 'Cuenta eliminada correctamente' });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { message: 'Error al eliminar la cuenta' }, 
      { status: 500 }
    );
  }
}