'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return currency;
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData || !userData.document_number) {
          router.push('/login');
          return;
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
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [router]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-blue-900 pt-24">
      <Header />
      <div className="container max-w-4xl p-8 bg-white bg-opacity-75 rounded-lg shadow-lg mt-24">
        <h1 className="text-xl font-bold mb-6 text-center text-white">Cuentas Bancarias</h1>
        {accounts.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-white">
                <th className="p-2">IBAN</th>
                <th className="p-2">Saldo</th>
                <th className="p-2">Fecha de Apertura</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.iban} className="text-white bg-blue-900 bg-opacity-75">
                  <td className="p-2">{account.iban}</td>
                  <td className="p-2">{account.total_balance} {getCurrencySymbol(account.currency)}</td>
                  <td className="p-2">{new Date(account.opening_date).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => router.push(`/dashboard/accounts/close_account?iban=${account.iban}`)}
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
          <p className="text-white text-center">No se encontraron cuentas</p>
        )}
      </div>
    </div>
  );
}