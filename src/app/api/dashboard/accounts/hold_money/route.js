import { holdMoney } from '@/lib/accounts';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { iban, amount } = await request.json();

    if (!iban || !amount) {
      return NextResponse.json(
        { message: 'IBAN y cantidad son requeridos' }, 
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: 'La cantidad debe ser mayor que 0' },
        { status: 400 }
      );
    }

    await holdMoney(iban, amount);
    
    return NextResponse.json({ 
      message: 'Dinero retenido correctamente',
      success: true 
    });

  } catch (error) {
    console.error('Error al retener dinero:', error);
    return NextResponse.json(
      { message: error.message }, 
      { status: 500 }
    );
  }
}