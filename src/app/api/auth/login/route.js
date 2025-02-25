// app/api/auth/login/route.js
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const { document_number, password } = await request.json();
    const userData = await loginUser(document_number, password);
    return Response.json(userData);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}