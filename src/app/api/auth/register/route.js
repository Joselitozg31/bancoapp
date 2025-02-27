// app/api/auth/register/route.js
import { registerUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const userData = await request.json(); // Extraer datos del cuerpo de la solicitud
    await registerUser(userData); // Llamar a la función registerUser para registrar al usuario
    return Response.json({ message: 'Usuario registrado correctamente' }); // Devolver un mensaje de éxito
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 }); // Devolver un mensaje de error si ocurre una excepción
  }
}