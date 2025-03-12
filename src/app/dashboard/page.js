'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const [accountCurrencies, setAccountCurrencies] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Obtener el objeto user desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.document_id) {
      const userDocumentId = user.document_id;
      setUserDocumentId(userDocumentId);

      const fetchTransactions = async () => {
        try {
          const response = await axios.get('/api/dashboard/transactions', {
            params: { user_document_id: userDocumentId }
          });
          setTransactions(response.data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };

      const fetchAccounts = async () => {
        try {
          const response = await axios.get('/api/dashboard/accounts/list_account', {
            params: { user_document_id: userDocumentId }
          });
          setAccounts(response.data);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };

      const fetchCards = async () => {
        try {
          const response = await axios.get('/api/dashboard/cards/list_card', {
            params: { user_document_id: userDocumentId }
          });
          setCards(response.data);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      fetchTransactions();
      fetchAccounts();
      fetchCards();
    }
  }, []);

  useEffect(() => {
    const fetchAccountCurrencies = async () => {
      const uniqueIbans = [...new Set(transactions.map(transaction => transaction.account_iban))];
      const currencies = {};

      for (const iban of uniqueIbans) {
        try {
          const response = await axios.get('/api/dashboard/accounts/list_account', {
            params: { iban }
          });
          currencies[iban] = response.data.currency;
        } catch (error) {
          console.error('Error fetching account currency:', error);
        }
      }

      setAccountCurrencies(currencies);
    };

    if (transactions.length > 0) {
      fetchAccountCurrencies();
    }
  }, [transactions]);

  const renderTransactions = (type, limit = 5) => {
    return transactions
      .filter(transaction => transaction.transaction_type === type)
      .slice(0, limit) // Mostrar solo las transacciones más recientes según el límite
      .map(transaction => (
        <tr key={transaction.transaction_id} className="bg-transparent">
          <td className={`bg-transparent rounded-lg ${type === 'income' ? 'text-green-500' : type === 'expense' ? 'text-red-500' : 'text-yellow-500'}`}>
            {transaction.amount} {getCurrencySymbol(accountCurrencies[transaction.account_iban])}
          </td>
          <td className={`bg-transparent rounded-lg ${type === 'income' ? 'text-green-500' : type === 'expense' ? 'text-red-500' : 'text-yellow-500'}`}>
            {new Date(transaction.transaction_date).toLocaleString()}
          </td>
          <td className={`bg-transparent rounded-lg ${type === 'income' ? 'text-green-500' : type === 'expense' ? 'text-red-500' : 'text-yellow-500'}`}>
            {transaction.concept}
          </td>
        </tr>
      ));
  };

  const renderAllHeldTransactions = () => {
    return transactions
      .filter(transaction => transaction.transaction_type === 'held')
      .map(transaction => (
        <tr key={transaction.transaction_id} className="bg-transparent">
          <td className="bg-transparent text-yellow-500 rounded-lg">{transaction.amount} {getCurrencySymbol(accountCurrencies[transaction.account_iban])}</td>
          <td className="bg-transparent text-yellow-500 rounded-lg">{new Date(transaction.transaction_date).toLocaleString()}</td>
          <td className="bg-transparent text-yellow-500 rounded-lg">{transaction.concept}</td>
        </tr>
      ));
  };

  const renderAccounts = () => {
    return accounts.map(account => (
      <tr key={account.iban} className="bg-transparent">
        <td className="bg-transparent text-white rounded-lg">{account.iban}</td>
        <td className="bg-transparent text-white rounded-lg">{account.balance} {getCurrencySymbol(account.currency)}</td>
      </tr>
    ));
  };

  const renderCards = () => {
    return cards.map(card => (
      <tr key={card.card_number} className="bg-transparent">
        <td className="bg-transparent text-white rounded-lg">{card.card_number}</td>
        <td className="bg-transparent text-white rounded-lg">{card.card_type}</td>
        <td className="bg-transparent text-white rounded-lg">{card.expiry_date}</td>
      </tr>
    ));
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'MXN':
        return '₱';
      default:
        return currency;
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6">
      <Header />
      <div className="container max-w-3xl p-8 mt-16">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-wrap justify-between space-y-12">
          <div className="w-full md:w-1/3 mb-24 mt-12">
            <h2 className="text-2xl font-bold mb-4">Listar Cuenta</h2>
            <div className="overflow-y-auto max-h-64 bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">IBAN</th><th className="text-white">Balance</th>
                  </tr>
                </thead>
                <tbody>{renderAccounts()}</tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-24 mt-12">
            <h2 className="text-2xl font-bold mb-4">Tarjetas</h2>
            <div className="overflow-y-auto max-h-64 bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">Número de Tarjeta</th><th className="text-white">Tipo</th><th className="text-white">Fecha de Expiración</th>
                  </tr>
                </thead>
                <tbody>{renderCards()}</tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-24 mt-12">
            <h2 className="text-2xl font-bold mb-4">Ingresos Recientes</h2>
            <div className="overflow-y-auto max-h-64 bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">Monto</th><th className="text-white">Fecha</th><th className="text-white">Concepto</th>
                  </tr>
                </thead>
                <tbody>{renderTransactions('income')}</tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-24 mt-12">
            <h2 className="text-2xl font-bold mb-4">Gastos Recientes</h2>
            <div className="overflow-y-auto max-h-64 bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">Monto</th><th className="text-white">Fecha</th><th className="text-white">Concepto</th>
                  </tr>
                </thead>
                <tbody>{renderTransactions('expense')}</tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-24 mt-12">
            <h2 className="text-2xl font-bold mb-4">Retenidos</h2>
            <div className="overflow-y-auto max-h-64 bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">Monto</th><th className="text-white">Fecha</th><th className="text-white">Concepto</th>
                  </tr>
                </thead>
                <tbody>{renderAllHeldTransactions()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;