'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';

// Lista de países
const countries = [
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombia' },
  { value: 'US', label: 'Estados Unidos' },
];

// Lista de nacionalidades
const nationalities = [
  { value: 'ES', label: 'Española' },
  { value: 'MX', label: 'Mexicana' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombiana' },
  { value: 'US', label: 'Estadounidense' },
];

// Lista de tipos de documento
const documentTypes = [
  { value: 'DNI', label: 'DNI' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'NIE', label: 'NIE' },
];

// Lista de prefijos telefónicos
const phonePrefixes = [
  { value: '+34', label: '+34' },
  { value: '+52', label: '+52' },
  { value: '+54', label: '+54' },
  { value: '+57', label: '+57' },
  { value: '+1', label: '+1' },
];

export default function Registro() {
  const [formData, setFormData] = useState({
    document_number: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    phone_prefix: '',
    phone: '',
    country: '',
    nationality: '',
    document_type: '',
    address: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que todos los campos estén llenos
    for (const key in formData) {
      if (!formData[key]) {
        setError('Todos los campos son obligatorios');
        return;
      }
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar que el usuario sea mayor de 18 años
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18 || (age === 18 && today.getMonth() < birthDate.getMonth())) {
      setError('Debes ser mayor de 18 años para registrarte');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Registro
        </h1>
        {error && (
          <p className="text-red-400 text-center mb-4 animate-bounce">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="first_name"
              placeholder="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <div className="flex space-x-4">
            <CustomSelect
              options={phonePrefixes}
              value={formData.phone_prefix}
              onChange={(selectedOption) =>
                handleSelectChange('phone_prefix', selectedOption)
              }
              placeholder="Prefijo"
              className="w-1/4"
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              className="w-3/4 px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
              required
            />
          </div>
          <div className="flex space-x-4">
            <CustomSelect
              options={documentTypes}
              value={formData.document_type}
              onChange={(selectedOption) =>
                handleSelectChange('document_type', selectedOption)
              }
              placeholder="Selecciona un tipo de documento"
              className="w-1/2"
            />
            <input
              type="text"
              name="document_number"
              placeholder="Número de documento"
              value={formData.document_number}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
              required
            />
          </div>
          <input
            type="date"
            name="birth_date"
            placeholder="Fecha de nacimiento"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <div className="flex space-x-4">
            <CustomSelect
              options={countries}
              value={formData.country}
              onChange={(selectedOption) =>
                handleSelectChange('country', selectedOption)
              }
              placeholder="Selecciona un país"
              className="w-1/2"
            />
            <CustomSelect
              options={nationalities}
              value={formData.nationality}
              onChange={(selectedOption) =>
                handleSelectChange('nationality', selectedOption)
              }
              placeholder="Selecciona una nacionalidad"
              className="w-1/2"
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirmar contraseña"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-white/30 focus:bg-white/30"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-white/70">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}