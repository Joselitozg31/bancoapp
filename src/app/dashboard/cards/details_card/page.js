// monje front end
"use client";

import React, { useState, useEffect } from 'react';

const Page = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.document_number) {
          throw new Error('User document number is missing');
        }

        const response = await fetch('/api/dashboard/cards/details_card', {
          headers: {
            'user_document_number': user.document_number
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading cards: {error.message}</p>;

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="container max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Detalles de la Tarjeta</h1>
        <ul className="space-y-4">
          {cards.map((card) => (
            <li key={card.card_number} className="p-4 rounded-lg shadow-md">
              <p className="text-xl font-bold">Número de Tarjeta: <span className="font-normal">{card.card_number}</span></p>
              <p className="text-xl font-bold">Tipo de Tarjeta: <span className="font-normal">{card.card_type}</span></p>
              <p className="text-xl font-bold">Fecha de Expiración: <span className="font-normal">{card.expiration_date}</span></p>
              <p className="text-xl font-bold">Fecha de Contratación: <span className="font-normal">{card.hiring_date}</span></p>
              <p className="text-xl font-bold">CCV: <span className="font-normal">{card.ccv}</span></p>
              <p className="text-xl font-bold">IBAN de la Cuenta: <span className="font-normal">{card.account_iban}</span></p>
              <p className="text-xl font-bold">Número de Documento del Usuario: <span className="font-normal">{card.user_document_number}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;