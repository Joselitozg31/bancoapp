'use client';
// Importar módulos necesarios
import { useState, useEffect } from 'react';

// Función principal para la página de tarjetas
export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar las tarjetas al montar el componente
  useEffect(() => {
    fetch('/api/dashboard/list_cards')
      .then(response => response.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
        setLoading(false);
      });
  }, []);

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) return <div>Cargando...</div>;

  // Renderizar la tabla de tarjetas
  return (
    <div>
      <h1>Tarjetas Bancarias</h1>
      <table>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Tipo de Tarjeta</th>
            <th>Fecha de Expiración</th>
            <th>Fecha de Contratación</th>
            <th>CCV</th>
            <th>IBAN de la Cuenta</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.card_number}>
              <td>{card.card_number}</td>
              <td>{card.card_type}</td>
              <td>{card.expiration_date}</td>
              <td>{card.hiring_date}</td>
              <td>{card.ccv}</td>
              <td>{card.account_iban}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}