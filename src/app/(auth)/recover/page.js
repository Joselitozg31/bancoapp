'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter code and new password
  const router = useRouter();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('El correo electrónico es obligatorio');
      return;
    }

    try {
      const response = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Save recovery code to localStorage
      localStorage.setItem('recoveryCode', data.recoveryCode);
      localStorage.setItem('recoveryEmail', email);

      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico');
      setStep(2); // Move to step 2
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!recoveryCode || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const storedRecoveryCode = localStorage.getItem('recoveryCode');
    const storedEmail = localStorage.getItem('recoveryEmail');

    if (recoveryCode !== storedRecoveryCode) {
      setError('El código de recuperación no es válido');
      return;
    }

    try {
      const response = await fetch('/api/auth/password_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage('Tu contraseña ha sido actualizada');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container">
        <h1>Recuperar contraseña</h1>
        {error && (
          <p className="error">{error}</p>
        )}
        {message && (
          <p className="message">{message}</p>
        )}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-center space-x-4 mt-4">
              <button type="submit" className="bg-blue-700 text-white p-3 rounded-lg">
                Enviar enlace de recuperación
              </button>
              <button type="button" className="bg-gray-500 text-white p-3 rounded-lg" onClick={() => router.push('/login')}>
                Cancelar
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="text"
              placeholder="Código de recuperación"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-center space-x-4 mt-4">
              <button type="submit" className="bg-blue-700 text-white p-3 rounded-lg">
                Actualizar contraseña
              </button>
              <button type="button" className="bg-gray-500 text-white p-3 rounded-lg" onClick={() => router.push('/login')}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}