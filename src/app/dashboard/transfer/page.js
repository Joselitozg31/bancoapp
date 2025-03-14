"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function TransferPage() {
  // Estado para almacenar las cuentas del usuario
  const [accounts, setAccounts] = useState([]); 
  // Estado para almacenar la cuenta seleccionada
  const [selectedAccount, setSelectedAccount] = useState(''); 
  // Estado para almacenar el IBAN de destino
  const [destinationIban, setDestinationIban] = useState(''); 
  // Estado para almacenar el nombre del destinatario
  const [destinationName, setDestinationName] = useState(''); 
  // Estado para almacenar el apellido del destinatario
  const [destinationLastName, setDestinationLastName] = useState(''); 
  // Estado para almacenar el importe de la transferencia
  const [amount, setAmount] = useState(''); 
  // Estado para almacenar el concepto de la transferencia
  const [concept, setConcept] = useState(''); 
  // Estado para almacenar mensajes de error
  const [error, setError] = useState(''); 
  // Hook para la navegación
  const router = useRouter(); 
  
  useEffect(() => {
    // Función para obtener las cuentas del usuario
    const fetchAccounts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.document_number) {
          throw new Error('Usuario no autenticado');
        }

        const response = await fetch('/api/dashboard/accounts/list_account', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userData.document_number,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching accounts');
        }

        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Error al obtener las cuentas');
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que los campos no estén vacíos
    if (!selectedAccount || !destinationIban || !destinationName || !destinationLastName || !amount || !concept) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData || !userData.document_number) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch('/api/dashboard/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'document_number': userData.document_number,
        },
        body: JSON.stringify({
          originIban: selectedAccount,
          destinationIban,
          destinationName,
          destinationLastName,
          amount,
          concept,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      alert('Transferencia realizada con éxito');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al realizar la transferencia');
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-blue-900 pt-24">
      <Header />
      <div className="container max-w-3xl p-8 bg-white bg-opacity-75 rounded-lg shadow-lg mt-24">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Transferencia</h1>
        {error && (
          <p className="error">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md">
              <label htmlFor="originAccount" className="block text-white">Cuenta Origen</label>
              <select
                id="originAccount"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                required
                className="w-full text-white"
              >
                <option value="">Seleccione una cuenta</option>
                {accounts.map(account => (
                  <option key={account.iban} value={account.iban} className="text-black">
                    {account.iban}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="destinationIban" className="block text-white">Cuenta Destino (IBAN)</label>
              <input
                type="text"
                id="destinationIban"
                value={destinationIban}
                onChange={(e) => setDestinationIban(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="destinationName" className="block text-white">Nombre del Destinatario</label>
              <input
                type="text"
                id="destinationName"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="destinationLastName" className="block text-white">Apellido del Destinatario</label>
              <input
                type="text"
                id="destinationLastName"
                value={destinationLastName}
                onChange={(e) => setDestinationLastName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="amount" className="block text-white">Importe</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="concept" className="block text-white">Concepto</label>
              <input
                type="text"
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button type="submit" className="bg-blue-700 text-white p-2 rounded-lg">
                Enviar
              </button>
              <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => router.push('/dashboard')}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}