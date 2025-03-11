'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Obtener datos del usuario del localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData || !userData.document_number) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/dashboard/cards/list_card', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userData.document_number
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las tarjetas');
        }

        const data = await response.json();
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [router]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-blue-900 pt-24">
      <Header />
      <div className="container max-w-4xl p-8 bg-white bg-opacity-75 rounded-lg shadow-lg mt-24">
        <h1 className="text-xl font-bold mb-6 text-center text-white">Tarjetas Bancarias</h1>
        {cards.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-white">
                <th className="p-2">Número de Tarjeta</th>
                <th className="p-2">Tipo de Tarjeta</th>
                <th className="p-2">Fecha de Expiración</th>
                <th className="p-2">Fecha de Contratación</th>
                <th className="p-2">CCV</th>
                <th className="p-2">IBAN de la Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {cards.map(card => (
                <tr key={card.card_number} className="text-white bg-blue-900 bg-opacity-75">
                  <td className="p-2">{card.card_number}</td>
                  <td className="p-2">{card.card_type}</td>
                  <td className="p-2">{new Date(card.expiration_date).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(card.hiring_date).toLocaleDateString()}</td>
                  <td className="p-2">{card.ccv}</td>
                  <td className="p-2">{card.account_iban}</td>
                  <td className="p-2">
                    <button
                      onClick={() => router.push(`/dashboard/cards/close_card?cardNumber=${card.card_number}`)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-white text-center">No se encontraron tarjetas</p>
        )}
      </div>
    </div>
  );
}