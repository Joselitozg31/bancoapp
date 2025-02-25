// app/api/auth/register/route.js
import { registerUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const userData = await request.json();
    await registerUser(userData);
    return Response.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}