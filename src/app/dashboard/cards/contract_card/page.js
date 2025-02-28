// Importar módulos necesarios
import { useState } from 'react';

// Componente principal para la página de contratación de tarjetas
export default function ContractCardPage() {
  // Estado para los datos de la nueva tarjeta
  const [newCard, setNewCard] = useState({
    card_number: '',
    card_type: '',
    expiration_date: '',
    hiring_date: '',
    ccv: '',
    account_iban: '',
  });

  // Estado para las tarjetas existentes
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Enviar solicitud para contratar una nueva tarjeta
      const response = await fetch('/api/dashboard/contract_card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      // Manejar errores en la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Obtener la tarjeta creada de la respuesta
      const createdCard = await response.json();
      setCards([...cards, createdCard]);

      // Restablecer el formulario
      setNewCard({
        card_number: '',
        card_type: '',
        expiration_date: '',
        hiring_date: '',
        ccv: '',
        account_iban: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación de una tarjeta
  const handleDelete = async (card_number) => {
    setLoading(true);
    setError('');

    try {
      // Enviar solicitud para eliminar una tarjeta
      const response = await fetch(`/api/dashboard/delete_card?card_number=${card_number}`, {
        method: 'DELETE',
      });

      // Manejar errores en la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Actualizar el estado para eliminar la tarjeta de la lista
      setCards(cards.filter(card => card.card_number !== card_number));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Contratar Tarjeta</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Número de Tarjeta"
          value={newCard.card_number}
          onChange={e => setNewCard({ ...newCard, card_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tipo de Tarjeta"
          value={newCard.card_type}
          onChange={e => setNewCard({ ...newCard, card_type: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Fecha de Expiración"
          value={newCard.expiration_date}
          onChange={e => setNewCard({ ...newCard, expiration_date: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Fecha de Contratación"
          value={newCard.hiring_date}
          onChange={e => setNewCard({ ...newCard, hiring_date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="CCV"
          value={newCard.ccv}
          onChange={e => setNewCard({ ...newCard, ccv: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="IBAN de la Cuenta"
          value={newCard.account_iban}
          onChange={e => setNewCard({ ...newCard, account_iban: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Tarjeta'}
        </button>
      </form>

      <h2>Tarjetas Existentes</h2>
      <table>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Tipo de Tarjeta</th>
            <th>Fecha de Expiración</th>
            <th>Fecha de Contratación</th>
            <th>CCV</th>
            <th>IBAN de la Cuenta</th>
            <th>Acciones</th>
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
              <td>
                <button onClick={() => handleDelete(card.card_number)} disabled={loading}>
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}