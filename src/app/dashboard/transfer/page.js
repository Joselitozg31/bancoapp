"use client";

import React, { useState, useEffect } from 'react';

export default function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [destinationIban, setDestinationIban] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [destinationLastName, setDestinationLastName] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user accounts
    fetch('/api/dashboard/list_accounts')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error('Error fetching accounts:', error));
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
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="min-h-full flex items-center justify-center">
      <div className="container max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Transferencia</h1>
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
                className="w-full"
              >
                <option value="">Seleccione una cuenta</option>
                {accounts.map(account => (
                  <option key={account.iban} value={account.iban}>
                    {account.iban} - {account.opening_date} - {account.account_type}
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
              <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => window.location.reload()}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}