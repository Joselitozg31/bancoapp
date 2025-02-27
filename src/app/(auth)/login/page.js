'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect'; // Importa el componente CustomSelect

export default function Login() {
  const [document_number, setDocumentNumber] = useState('');
  const [document_type, setDocumentType] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que los campos no estén vacíos
    if (!document_number || !password || !document_type) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_number, document_type, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const userData = await response.json();
      if (rememberUser) {
        localStorage.setItem('user', JSON.stringify(userData)); // Guardar datos del usuario en localStorage
      }
      router.push('/dashboard'); // Redirigir al dashboard después del login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="container">
        <h1>Te damos la bienvenida a tu banca online</h1>
        {error && (
          <p className="error">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Número de documento"
              value={document_number}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
            />
            <CustomSelect
              options={[
                { value: 'DNI', label: 'DNI' },
                { value: 'Pasaporte', label: 'Pasaporte' },
                { value: 'NIE', label: 'NIE' },
              ]}
              value={document_type}
              onChange={(selectedOption) => setDocumentType(selectedOption.value)}
              placeholder="Tipo de documento"
              required
            />
          </div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-center items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={rememberUser}
              onChange={(e) => setRememberUser(e.target.checked)}
            />
            <label>Recordar usuario</label>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button type="submit" className="bg-blue-700 text-white p-2 rounded-lg">
              Acceder
            </button>
            <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => router.push('/register')}>
              Hazte cliente
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          <a href="/recover">Recuperar contraseña</a>
        </p>
      </div>
    </div>
  );
}