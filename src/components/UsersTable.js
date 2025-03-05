"use client"
import { useEffect, useState } from 'react';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    document_number: '' // Add document_number to formData
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/dashboard/user');
        if (!response.ok) {
          throw new Error('Error fetching users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/update_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password, document_number: formData.document_number }),
      });

      if (!response.ok) {
        throw new Error('Error updating password');
      }

      setError(null);
      alert('Contraseña actualizada con éxito');
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <h1 className="text-3xl font-bold mb-6 text-white"></h1>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
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
        ))}
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
        <input
          type="text"
          name="document_number"
          placeholder="Número de documento"
          value={formData.document_number}
          onChange={handleChange}
          className="w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}