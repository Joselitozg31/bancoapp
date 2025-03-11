'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function ContractCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    card_type: '',
    account_iban: ''
  });

  useEffect(() => {
    // Cargar las cuentas del usuario para seleccionar a cuál vincular la tarjeta
    const fetchAccounts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.document_number) {
          throw new Error('Usuario no autenticado');
        }

        const response = await fetch('/api/dashboard/accounts/list_account', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userData.document_number
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las cuentas');
        }

        const data = await response.json();
        setAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.document_number) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch('/api/dashboard/cards/contract_card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'document_number': userData.document_number
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al contratar la tarjeta');
      }

      router.push('/dashboard/cards/list_card');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-blue-900 pt-24">
      <Header />
      <div className="container max-w-2xl p-8 bg-white bg-opacity-75 rounded-lg shadow-lg mt-24">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Contratar Nueva Tarjeta</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Tipo de Tarjeta</label>
            <select
              value={formData.card_type}
              onChange={(e) => setFormData({...formData, card_type: e.target.value})}
              className="w-full p-2 rounded"
              required
            >
              <option value="">Seleccione tipo de tarjeta</option>
              <option value="DEBITO">Tarjeta de Débito</option>
              <option value="CREDITO">Tarjeta de Crédito</option>
              <option value="PREPAGO">Tarjeta Prepago</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Cuenta Asociada</label>
            <select
              value={formData.account_iban}
              onChange={(e) => setFormData({...formData, account_iban: e.target.value})}
              className="w-full p-2 rounded"
              required
            >
              <option value="">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.iban} value={account.iban}>
                  {account.iban} - {account.account_type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Contratando...' : 'Contratar Tarjeta'}
          </button>
        </form>
      </div>
    </div>
  );
}