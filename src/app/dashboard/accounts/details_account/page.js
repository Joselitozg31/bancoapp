"use client";
import Header from '@/components/header';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const iban = searchParams.get('iban');

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.document_number) {
          throw new Error('User document number is missing');
        }

        console.log('Fetching account details for IBAN:', iban);

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

        setSelectedAccount(data);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (iban) {
      fetchAccountDetails();
    }
  }, [iban]);

  if (loading) return <p>Loading...</p>;
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
      </div>
    </div>
  );
};

export default Page;
