import { listAccount, contractAccount } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';

// Función para manejar la solicitud GET
export async function GET(request) {
  const token = request.cookies.get('token'); // Obtener el token de las cookies

  // Verificar si el token está presente
  if (!token) {
    return Response.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const user = verifyToken(token); // Verificar el token
    const accounts = await listAccount(user.document_number); // Obtener las cuentas del usuario
    return Response.json(accounts); // Devolver las cuentas en la respuesta
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 }); // Manejar errores y devolver un mensaje de error
  }
}

// Función para manejar la solicitud POST
export async function POST(request) {
  const token = request.cookies.get('token'); // Obtener el token de las cookies

  // Verificar si el token está presente
  if (!token) {
    return Response.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const user = verifyToken(token); // Verificar el token
    const accountData = await request.json(); // Obtener los datos de la cuenta del cuerpo de la solicitud
    const accountId = await contractAccount({ ...accountData, document_number: user.document_number }); // Crear la cuenta
    return Response.json({ id: accountId }); // Devolver el ID de la cuenta creada en la respuesta
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 }); // Manejar errores y devolver un mensaje de error
  }
}