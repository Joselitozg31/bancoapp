import { useState } from 'react';

// Componente principal para la página de contratación de cuentas
export default function ContractAccountPage() {
  // Estado para la nueva cuenta
  const [newAccount, setNewAccount] = useState({
    iban: '',
    account_type: '',
    currency: '',
    total_balance: '',
    available_balance: '',
    held_balance: '',
    opening_date: ''
  });

  // Estado para las cuentas existentes
  const [accounts, setAccounts] = useState([]);
  // Estado para el indicador de carga
  const [loading, setLoading] = useState(false);
  // Estado para el mensaje de error
  const [error, setError] = useState('');

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdAccount = await response.json();
      setAccounts([...accounts, createdAccount]);
      setNewAccount({
        iban: '',
        account_type: '',
        currency: '',
        total_balance: '',
        available_balance: '',
        held_balance: '',
        opening_date: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (iban) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/accounts/${iban}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setAccounts(accounts.filter(account => account.iban !== iban));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Contratar Cuenta</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="IBAN"
          value={newAccount.iban}
          onChange={e => setNewAccount({ ...newAccount, iban: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tipo de Cuenta"
          value={newAccount.account_type}
          onChange={e => setNewAccount({ ...newAccount, account_type: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Moneda"
          value={newAccount.currency}
          onChange={e => setNewAccount({ ...newAccount, currency: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Balance Total"
          value={newAccount.total_balance}
          onChange={e => setNewAccount({ ...newAccount, total_balance: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Balance Disponible"
          value={newAccount.available_balance}
          onChange={e => setNewAccount({ ...newAccount, available_balance: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Balance Retenido"
          value={newAccount.held_balance}
          onChange={e => setNewAccount({ ...newAccount, held_balance: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Fecha de Apertura"
          value={newAccount.opening_date}
          onChange={e => setNewAccount({ ...newAccount, opening_date: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Cuenta'}
        </button>
      </form>

      <h2>Cuentas Existentes</h2>
      <table>
        <thead>
          <tr>
            <th>IBAN</th>
            <th>Tipo de Cuenta</th>
            <th>Moneda</th>
            <th>Balance Total</th>
            <th>Balance Disponible</th>
            <th>Balance Retenido</th>
            <th>Fecha de Apertura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.iban}>
              <td>{account.iban}</td>
              <td>{account.account_type}</td>
              <td>{account.currency}</td>
              <td>{account.total_balance}</td>
              <td>{account.available_balance}</td>
              <td>{account.held_balance}</td>
              <td>{account.opening_date}</td>
              <td>
                <button onClick={() => handleDelete(account.iban)} disabled={loading}>
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