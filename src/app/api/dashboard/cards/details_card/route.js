import { listCards } from '@/lib/cards';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const user_document_number = request.headers.get('user_document_number');
    if (!user_document_number) {
      return NextResponse.json({ message: 'User document number is required' }, { status: 400 });
    }
    const cards = await listCards(user_document_number);
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}