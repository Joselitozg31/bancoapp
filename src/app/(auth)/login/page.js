'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [document_number, setDocumentNumber] = useState(''); // Estado para el número de documento
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [rememberUser, setRememberUser] = useState(false); // Estado para la opción de recordar usuario
  const [error, setError] = useState(''); // Estado para los mensajes de error
  const router = useRouter(); // Hook de Next.js para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError(''); // Limpiar cualquier mensaje de error previo

    // Validar que los campos no estén vacíos
    if (!document_number || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_number, password }), // Enviar los datos del formulario al servidor
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message); // Lanzar un error si la respuesta no es exitosa
      }

      const userData = await response.json();
      if (rememberUser) {
        localStorage.setItem('user', JSON.stringify(userData)); // Guardar datos del usuario en localStorage si se seleccionó "Recordar usuario"
      }
      router.push('/dashboard'); // Redirigir al dashboard después del login
    } catch (err) {
      setError(err.message); // Mostrar el mensaje de error
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="container max-w-3xl p-8"> {/* Contenedor principal */}
        <h1 className="text-3xl font-bold mb-6 text-white">Te damos la bienvenida a tu banca online</h1>
        {error && (
          <p className="error">{error}</p> // Mostrar mensaje de error si existe
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4"> {/* Centrando los elementos */}
            <input
              type="text"
              placeholder="Número de documento"
              value={document_number}
              onChange={(e) => setDocumentNumber(e.target.value)} // Actualizar el estado del número de documento
              required
              className="w-full max-w-md"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualizar el estado de la contraseña
              required
              className="w-full max-w-md"
            />
            <div className="flex justify-center items-center space-x-2 mt-4">
              <input
                type="checkbox"
                checked={rememberUser}
                onChange={(e) => setRememberUser(e.target.checked)} // Actualizar el estado de "Recordar usuario"
              />
              <label className="text-white">Recordar usuario</label>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button type="submit" className="bg-blue-700 text-white p-2 rounded-lg">
                Acceder
              </button>
              <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => router.push('/register')}>
                Hazte cliente
              </button>
            </div>
          </div>
        </form>
        <p className="mt-4 text-center">
          <a href="/recover" className="text-blue-400 hover:underline">Recuperar contraseña</a>
        </p>
      </div>
    </div>
  );
}