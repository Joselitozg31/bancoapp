'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';
import TermsModal from '@/components/TermsModal'; // Importa el componente del modal

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
  { value: '+34', label: '+34 (España)' },
  { value: '+52', label: '+52 (México)' },
  { value: '+54', label: '+54 (Argentina)' },
  { value: '+57', label: '+57 (Colombia)' },
  { value: '+1', label: '+1 (Estados Unidos)' },
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
    document_image: null, // Añadir este campo
    terms: false, // Añadir este campo
  });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const router = useRouter();

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document_image') {
      setFormData({ ...formData, [name]: files[0] }); // Guardar el archivo de imagen
    } else if (name === 'terms') {
      setFormData({ ...formData, [name]: e.target.checked }); // Guardar el estado del checkbox
    } else {
      setFormData({ ...formData, [name]: value }); // Guardar el valor del campo
    }
  };

  // Manejar cambios en los campos de selección
  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que todos los campos estén llenos
    for (const key in formData) {
      if (!formData[key] && key !== 'document_image' && key !== 'terms') {
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

    // Convertir la imagen a base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      // Guardar la imagen del documento y la aceptación de los términos en localStorage
      localStorage.setItem('document_image', base64Image);
      localStorage.setItem('terms_accepted', formData.terms.toString());

      // Enviar los datos al servidor
      const { document_image, terms, ...dataToSend } = formData;
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
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

    reader.readAsDataURL(formData.document_image);
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="container max-w-3xl p-8"> {/* Cambiado a max-w-3xl */}
      <h1 className="text-3xl font-bold mb-6 text-white">¡Ten tu cuenta en unos minutos!</h1>
        {error && (
          <p className="error">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="first_name"
              placeholder="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              className="w-1/2"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              className="w-1/2"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
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
              className="w-3/4"
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
              className="w-1/2"
              required
            />
          </div>
          <div className="relative w-full">
            <input
              type="file"
              name="document_image"
              accept="image/*" // Restringir a solo formatos de imagen
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="bg-blue-500 text-white p-3 rounded-lg border-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-600 flex items-center justify-center cursor-pointer">
              <span>Adjuntar imagen del documento</span>
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4m0 0l-4 4m4-4v12"></path>
              </svg>
            </div>
          </div>
          <input
            type="date"
            name="birth_date"
            placeholder="Fecha de nacimiento"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full bg-white/20 text-white p-3 rounded-lg border-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-white/30" // Añadido estilos
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
            onChange={handleChange} // Actualizar el estado de la dirección
            className="w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange} // Actualizar el estado de la contraseña
            className="w-full"
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirmar contraseña"
            value={formData.confirm_password}
            onChange={handleChange} // Actualizar el estado de confirmar la contraseña
            className="w-full"
            required
          />
          <div className="flex justify-center items-center space-x-2 mt-4">
            <input
              type="checkbox"
              name="terms"
              onChange={handleChange} // Actualizar el estado de aceptación de términos
              required
            />
            <label htmlFor="terms" className="text-white">
              Acepto los <a href="#" onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:underline">términos y condiciones</a>
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg border-none transition-all duration-300 cursor-pointer hover:bg-blue-600 transform hover:scale-105">
            Hazte cliente
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Inicia sesión</a>
        </p>
      </div>
      {isModalOpen && <TermsModal onClose={() => setIsModalOpen(false)} />} {/* Mostrar el modal */}
    </div>
  );
}
