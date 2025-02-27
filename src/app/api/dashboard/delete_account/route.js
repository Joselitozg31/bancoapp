import { deleteAccount } from '@/lib/accounts';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return Response.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    const { iban } = request.params;
    await deleteAccount(iban);
    return Response.json({ message: 'Cuenta eliminada' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}