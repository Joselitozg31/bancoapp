// app/api/auth/login/route.js
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const { document_number, password } = await request.json(); // Extraer datos del cuerpo de la solicitud
    const userData = await loginUser(document_number, password); // Llamar a la función loginUser para autenticar al usuario
    return Response.json(userData); // Devolver los datos del usuario en la respuesta
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 }); // Devolver un mensaje de error si ocurre una excepción
  }
}