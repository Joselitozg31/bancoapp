"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';

export default function TransactionsPage() {
  // Estado para almacenar las transacciones
  const [transactions, setTransactions] = useState([]); 
  // Estado para almacenar mensajes de error
  const [error, setError] = useState(''); 

  useEffect(() => {
    // Función para obtener el historial de transacciones
    const fetchTransactions = async () => {
      try {
        // Obtener los datos del usuario desde localStorage
        const userData = JSON.parse(localStorage.getItem('user'));

        // Verificar si el número de documento del usuario está presente
        if (!userData || !userData.document_number) {
          throw new Error('Usuario no autenticado');
        }

        // Realizar la solicitud para obtener el historial de transacciones
        const response = await fetch('/api/dashboard/historial', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userData.document_number,
          },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Error fetching transactions');
        }

        // Obtener los datos de la respuesta
        const data = await response.json();
        setTransactions(data); // Actualizar el estado con las transacciones
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Actualizar el estado con el mensaje de error
        setError('Error al obtener el historial de transacciones'); 
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-full flex items-center justify-center">
        <div className="container max-w-3xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Historial de Transacciones</h1>
          {error && (
            // Mostrar mensaje de error si existe
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
    </>
  );
}