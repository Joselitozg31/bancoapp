import { useState, useEffect } from 'react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts')
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

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Cuentas Bancarias</h1>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Titular</th>
            <th>Balance</th>
            <th>Moneda</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.iban}</td>
              <td>{account.account_type}</td>
              <td>${account.total_balance.toFixed(2)}</td>
              <td>{account.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}