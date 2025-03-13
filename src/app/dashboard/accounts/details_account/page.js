"use client";
import Header from '@/components/header';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  // Estado para almacenar los detalles de la cuenta seleccionada
  const [selectedAccount, setSelectedAccount] = useState(null);
  // Estado para almacenar las transacciones de la cuenta
  const [transactions, setTransactions] = useState([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Obtener los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();
  const iban = searchParams.get('iban');

  useEffect(() => {
    // Función para obtener los detalles de la cuenta
    const fetchAccountDetails = async () => {
      try {
        // Obtener el usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.document_number) {
          throw new Error('User document number is missing');
        }

        console.log('Fetching account details for IBAN:', iban);

        // Realizar la solicitud para obtener los detalles de la cuenta
        const response = await fetch(`/api/dashboard/accounts/details_account?iban=${iban}`, {
          headers: {
            'user_document_number': user.document_number
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Account details fetched:', data);

        // Actualizar el estado con los detalles de la cuenta y las transacciones
        setSelectedAccount(data.accountDetails);
        setTransactions(data.transactions);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Llamar a la función para obtener los detalles de la cuenta si el IBAN está presente
    if (iban) {
      fetchAccountDetails();
    }
  }, [iban]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) return <p>Loading...</p>;
  // Mostrar un mensaje de error si ocurre un error al obtener los datos
  if (error) return <p>Error loading account details: {error.message}</p>;

  return (
    <div className="min-h-full flex items-center justify-center">
      <Header />
      <div className="container max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Detalles de la Cuenta</h1>
        {selectedAccount ? (
          <div className="p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold">IBAN: <span className="font-normal">{selectedAccount.iban}</span></p>
            <p className="text-xl font-bold">Tipo de Cuenta: <span className="font-normal">{selectedAccount.account_type}</span></p>
            <p className="text-xl font-bold">Moneda: <span className="font-normal">{selectedAccount.currency}</span></p>
            <p className="text-xl font-bold">Saldo Total: <span className="font-normal">{selectedAccount.total_balance}</span></p>
            <p className="text-xl font-bold">Saldo Disponible: <span className="font-normal">{selectedAccount.available_balance}</span></p>
            <p className="text-xl font-bold">Saldo Retenido: <span className="font-normal">{selectedAccount.held_balance}</span></p>
            <p className="text-xl font-bold">Fecha de Apertura: <span className="font-normal">{selectedAccount.opening_date}</span></p>
          </div>
        ) : (
          <p>No se ha seleccionado ninguna cuenta</p>
        )}
        <h2 className="text-2xl font-bold mt-6 text-white">Historial de Transacciones</h2>
        <table className="min-w-full mt-4">
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
};

export default Page;
