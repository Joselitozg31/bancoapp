import { contratarSeguros } from '@/lib/insurance';

export async function POST(request) {
  try {
    const { selectedInsurances, userDocumentNumber, accountIban } = await request.json();
    const result = await contratarSeguros(selectedInsurances, userDocumentNumber, accountIban);
    return Response.json(result);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}