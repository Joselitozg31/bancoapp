"use client";

import React, { useEffect, useState } from 'react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.document_number) {
          throw new Error('Usuario no autenticado');
        }

        const response = await fetch('/api/dashboard/transactions', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userData.document_number,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching transactions');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error al obtener el historial de transacciones');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="container max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Historial de Transacciones</h1>
        {error && (
          <p className="error text-white">{error}</p>
        )}
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 text-white">ID</th>
              <th className="py-2 text-white">Cuenta Origen</th>
              <th className="py-2 text-white">Cuenta Destino</th>
              <th className="py-2 text-white">Importe</th>
              <th className="py-2 text-white">Fecha</th>
              <th className="py-2 text-white">Concepto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.transfer_id}>
                <td className="py-2 text-white">{transaction.transfer_id}</td>
                <td className="py-2 text-white">{transaction.origin_account_iban}</td>
                <td className="py-2 text-white">{transaction.destination_account_iban}</td>
                <td className="py-2 text-white">{transaction.amount}</td>
                <td className="py-2 text-white">{new Date(transaction.transfer_date).toLocaleString()}</td>
                <td className="py-2 text-white">{transaction.concept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}