import { contratarSeguros } from '@/lib/insurance';

export async function POST(request) {
  try {
    const { selectedInsurances, userDocumentNumber, accountIban } = await request.json(); // Extraer datos del cuerpo de la solicitud
    const result = await contratarSeguros(selectedInsurances, userDocumentNumber, accountIban); // Llamar a la función contratarSeguros para contratar los seguros seleccionados
    return Response.json(result); // Devolver el resultado de la contratación en la respuesta
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 }); // Devolver un mensaje de error si ocurre una excepción
  }
}