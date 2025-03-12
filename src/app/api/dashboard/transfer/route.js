// filepath: c:\xampp\htdocs\Desarrolo servidor\bancoapp\src\app\api\dashboard\transfer\route.js
import { NextResponse } from 'next/server';
import { transferFunds } from '@/lib/transfer'; 

export async function POST(request) {
  try {
    const { originIban, destinationIban, amount, concept } = await request.json();
    const document_number = request.headers.get('document_number');

    if (!document_number) {
      return NextResponse.json({ message: 'Usuario no autenticado' }, { status: 401 });
    }

    // Lógica para realizar la transferencia
    const result = await transferFunds({
      originIban,
      destinationIban,
      amount,
      concept
    });

    return NextResponse.json({ message: 'Transferencia realizada con éxito', result });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}