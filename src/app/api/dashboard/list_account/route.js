import { listAccount } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return Response.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    const accounts = await listAccount(user.document_number);
    return Response.json(accounts);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}