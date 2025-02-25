// app/(auth)/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [document_number, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que los campos no estén vacíos
    if (!document_number || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_number, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData)); // Guardar datos del usuario en localStorage
      router.push('/dashboard'); // Redirigir al dashboard después del login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Iniciar sesión
        </h1>
        {error && (
          <p className="text-red-400 text-center mb-4 animate-bounce">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Número de documento"
            value={document_number}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>
        <p className="mt-4 text-center text-white/70">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}