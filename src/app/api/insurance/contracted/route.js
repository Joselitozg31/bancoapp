import { getContractedInsurances } from '@/lib/insurance';

export async function POST(request) {
  try {
    const { userDocumentNumber, accountIban } = await request.json(); // Extraer datos del cuerpo de la solicitud
    const insurances = await getContractedInsurances(userDocumentNumber, accountIban); // Llamar a la función getContractedInsurances para obtener los seguros contratados
    return new Response(JSON.stringify({ insurances }), { status: 200 }); // Devolver los seguros contratados en la respuesta
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 }); // Devolver un mensaje de error si ocurre una excepción
  }
}