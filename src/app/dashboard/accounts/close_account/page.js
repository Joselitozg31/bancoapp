'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import CustomModal from '@/components/CustomModal';

export default function CloseAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountData, setAccountData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchAccountData = async () => {
      const iban = searchParams.get('iban');
      if (!iban) {
        router.push('/dashboard/accounts/list_account');
        return;
      }

      setAccountData({ iban });
    };

    fetchAccountData();
  }, [searchParams, router]);

  const handleCloseAccount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/dashboard/accounts/close_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iban: accountData.iban,
          documentNumber: userData.document_number,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setModalMessage('Cuenta dada de baja correctamente');
        setIsModalOpen(true);
        setTimeout(() => {
          router.push('/dashboard/accounts/list_account');
        }, 2000);
      } else {
        setModalMessage('Error: ' + result.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      setModalMessage('Error al dar de baja la cuenta');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-900">
      <Header />
      <div className="container mx-auto p-4 mb-16 max-w-2xl pt-24">
        <div className="bg-white/10 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Dar de baja cuenta</h1>
          
          {accountData && (
            <div className="space-y-6">
              <div className="text-white text-center">
                <p className="mb-4">¿Estás seguro que deseas dar de baja la siguiente cuenta?</p>
                <p className="text-xl font-semibold">{accountData.iban}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseAccount}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
                >
                  Confirmar baja
                </button>
                <button
                  onClick={() => router.push('/dashboard/accounts/list_account')}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Mensaje"
        message={modalMessage}
      />
    </div>
  );
}
