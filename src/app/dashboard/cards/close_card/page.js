'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import CustomModal from '@/components/CustomModal';

export default function CloseCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cardData, setCardData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchCardData = async () => {
      const cardNumber = searchParams.get('cardNumber');
      if (!cardNumber) {
        router.push('/dashboard/cards/list_card');
        return;
      }

      try {
        // Obtener los datos del usuario del localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          router.push('/login');
          return;
        }

        // Guardar los datos de la tarjeta
        setCardData({ 
          cardNumber,
          documentNumber: userData.document_number 
        });
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setModalMessage('Error al cargar los datos de la tarjeta');
        setIsModalOpen(true);
      }
    };

    fetchCardData();
  }, [searchParams, router]);

  const handleCloseCard = async () => {
    try {
      if (!cardData) {
        setModalMessage('Datos de tarjeta no disponibles');
        setIsModalOpen(true);
        return;
      }

      const response = await fetch('/api/dashboard/cards/close_card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: cardData.cardNumber,
          documentNumber: cardData.documentNumber,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setModalMessage('Tarjeta dada de baja correctamente');
        setIsModalOpen(true);
        // Esperar antes de redirigir
        setTimeout(() => {
          router.push('/dashboard/cards/list_card');
        }, 2000);
      } else {
        throw new Error(result.message || 'Error al dar de baja la tarjeta');
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage(error.message || 'Error al dar de baja la tarjeta');
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
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Dar de baja tarjeta</h1>
          
          {cardData && (
            <div className="space-y-6">
              <div className="text-white text-center">
                <p className="mb-4">¿Estás seguro que deseas dar de baja la siguiente tarjeta?</p>
                <p className="text-xl font-semibold">{cardData.cardNumber}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseCard}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
                >
                  Confirmar baja
                </button>
                <button
                  onClick={() => router.push('/dashboard/cards/list_card')}
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
