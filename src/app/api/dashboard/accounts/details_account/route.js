import { NextResponse } from 'next/server';
import { getAccountDetails } from '@/lib/accounts'; // Asegúrate de tener esta función implementada

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const iban = searchParams.get('iban');
  const userDocumentNumber = request.headers.get('user_document_number');

  if (!iban || !userDocumentNumber) {
    return NextResponse.json({ message: 'IBAN or user document number is missing' }, { status: 400 });
  }

  try {
    const accountDetails = await getAccountDetails(iban, userDocumentNumber);

    if (!accountDetails) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(accountDetails);
  } catch (error) {
    console.error('Error fetching account details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}