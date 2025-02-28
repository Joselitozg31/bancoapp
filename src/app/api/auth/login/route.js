// app/api/auth/login/route.js
import { loginUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { document_number, password } = await request.json();
    const { token, userData } = await loginUser(document_number, password);

    // Crear la respuesta JSON con los datos del usuario
    const response = NextResponse.json(userData);

    // Configurar la cookie del token con medidas de seguridad
    response.cookies.set('token', token, {
      httpOnly: true,  // Evita accesos desde JavaScript
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
      path: '/',
      maxAge: 3600,  // 1 hora de duración
      sameSite: 'strict', // Evita ataques CSRF
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
