// filepath: c:\xampp\htdocs\Desarrolo servidor\bancoapp\src\app\api\dashboard\transfer\route.js
import { NextResponse } from 'next/server';
import { transferFunds } from '@/lib/transfer'; 

export async function POST(request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { originIban, destinationIban, amount, concept } = await request.json();
    // Obtener el número de documento del usuario desde los encabezados de la solicitud
    const document_number = request.headers.get('document_number');

    // Verificar si el número de documento del usuario está presente
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

    // Devolver una respuesta exitosa con el resultado de la transferencia
    return NextResponse.json({ message: 'Transferencia realizada con éxito', result });
  } catch (error) {
    // Manejar errores y devolver un mensaje de error en la respuesta
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}