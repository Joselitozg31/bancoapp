'use client';
// Importar módulos necesarios
import { useState, useEffect } from 'react';

// Función principal para la página de cuentas
export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar las cuentas al montar el componente
  useEffect(() => {
    fetch('/api/dashboard/list_accounts')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching accounts:', error);
        setLoading(false);
      });
  }, []);

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) return <div>Cargando...</div>;

  // Renderizar la tabla de cuentas
  return (
    <div>
      <h1>Cuentas Bancarias</h1>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}