"use client"
import { useEffect, useState } from 'react';

export default function AreaPersonal() {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error
  const [formData, setFormData] = useState({
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

    console.log('Submitting data:', { password: formData.password, document_number: formData.document_number }); // Log para verificar los datos enviados

    try {
      const response = await fetch('/api/dashboard/update_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password, document_number: formData.document_number }),
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

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Datos del Usuario</h1>
        <div className="grid grid-cols-1 gap-4">
          {user ? (
            <div key={user.document_number}>
              <p><strong>Document Number:</strong> {user.document_number}</p>
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Last Name:</strong> {user.last_name}</p>
              <p><strong>Birth Date:</strong> {user.birth_date}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Nationality:</strong> {user.nationality}</p>
              <p><strong>Document Type:</strong> {user.document_type}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
              <p><strong>Registration Date:</strong> {user.registration_date}</p>
            </div>
          ) : (
            <p>Cargando datos del usuario...</p> // Mostrar mensaje de carga mientras se obtienen los datos del usuario
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nueva contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}