import { getContractedInsurances } from '@/lib/insurance';

export async function POST(request) {
  try {
    const { userDocumentNumber, accountIban } = await request.json();
    const insurances = await getContractedInsurances(userDocumentNumber, accountIban);
    return new Response(JSON.stringify({ insurances }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}