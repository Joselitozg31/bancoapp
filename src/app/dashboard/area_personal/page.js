"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/header';

const countries = [
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombia' },
  { value: 'US', label: 'Estados Unidos' },
];

const nationalities = [
  { value: 'ES', label: 'Española' },
  { value: 'MX', label: 'Mexicana' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombiana' },
  { value: 'US', label: 'Estadounidense' },
];

export default function AreaPersonal() {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
    document_number: '' // Inicialmente vacío
  });

  useEffect(() => {
    // Obtener los datos del usuario desde localStorage después de que el componente se haya montado
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('User data from localStorage:', userData); // Log para verificar los datos del usuario

    if (userData && userData.document_number) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        document_number: userData.document_number
      }));

      async function fetchUser() {
        try {
          const response = await fetch(`/api/dashboard/user?document_number=${userData.document_number}`);
          if (!response.ok) {
            throw new Error('Error fetching user');
          }
          const data = await response.json();
          console.log('User data:', data); // Log para verificar los datos del usuario
          setUser(data);
        } catch (error) {
          setError(error.message);
        }
      }

      fetchUser();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualizar el estado del formulario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    console.log('Submitting data:', { currentPassword: formData.currentPassword, password: formData.password, document_number: formData.document_number }); // Log para verificar los datos enviados

    try {
      const response = await fetch('/api/dashboard/update_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword: formData.currentPassword, password: formData.password, document_number: formData.document_number }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message); // Lanzar un error si la respuesta no es exitosa
      }

      setError(null);
      alert('Contraseña actualizada con éxito');
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>; // Mostrar mensaje de error si existe
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCountryLabel = (value) => {
    const country = countries.find(country => country.value === value);
    return country ? country.label : value;
  };

  const getNationalityLabel = (value) => {
    const nationality = nationalities.find(nationality => nationality.value === value);
    return nationality ? nationality.label : value;
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <Header />
      <div className="container max-w-3xl p-8">
        <h1 className="text-xl font-bold mb-6 text-white">Datos del Usuario</h1>
        <div className="grid grid-cols-1 gap-4">
          {user ? (
            <div key={user.document_number}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xl font-bold"><strong>Tipo de Documento:</strong></p>
                  <p className="text-xl">{user.document_type}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Numero de Documento:</strong></p>
                  <p className="text-xl">{user.document_number}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div>
                  <p className="text-xl font-bold"><strong>Nombre:</strong></p>
                  <p className="text-xl">{user.first_name}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Apellido:</strong></p>
                  <p className="text-xl">{user.last_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div>
                  <p className="text-xl font-bold"><strong>Correo electronico:</strong></p>
                  <p className="text-xl">{user.email}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Telefono:</strong></p>
                  <p className="text-xl">{user.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Contraseña actual"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full text-lg"
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded-lg border-none transition-all duration-300 cursor-pointer hover:bg-blue-600 transform hover:scale-105 text-lg">
                    💾
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Nueva contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-lg"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div>
                  <p className="text-xl font-bold"><strong>Fecha de cumpleaños:</strong></p>
                  <p className="text-xl">{formatDate(user.birth_date)}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Fecha de registro:</strong></p>
                  <p className="text-xl">{formatDate(user.registration_date)}</p>
                </div>
              </div>
              <h2 className="text-xl font-bold mt-6">Datos Fiscales</h2>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div>
                  <p className="text-xl font-bold"><strong>Pais:</strong></p>
                  <p className="text-xl">{getCountryLabel(user.country)}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Nacionalidad:</strong></p>
                  <p className="text-xl">{getNationalityLabel(user.nationality)}</p>
                </div>
                <div>
                  <p className="text-xl font-bold"><strong>Direccion:</strong></p>
                  <p className="text-xl">{user.address}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xl">Cargando datos del usuario...</p> // Mostrar mensaje de carga mientras se obtienen los datos del usuario
          )}
        </div>
      </div>
    </div>
  );
}