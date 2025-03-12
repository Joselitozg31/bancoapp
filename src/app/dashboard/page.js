'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [userDocumentNumber, setUserDocumentNumber] = useState('');
  const [accountCurrencies, setAccountCurrencies] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [selectedAccountForMoney, setSelectedAccountForMoney] = useState('');
  const [amountToAdd, setAmountToAdd] = useState('');
  const [operationType, setOperationType] = useState('add'); // 'add', 'withdraw', 'hold'
  const [modalTitle, setModalTitle] = useState('Agregar Dinero');
  const router = useRouter();

  useEffect(() => {
    // Obtener el objeto user desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.document_number) {
      const userDocumentNumber = user.document_number;
      setUserDocumentNumber(userDocumentNumber);

      const fetchTransactions = async () => {
        try {
          const response = await axios.get('/api/transactions', {
            params: { user_document_number: userDocumentNumber }
          });
          setTransactions(response.data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setError(error.message);
        }
      };

      const fetchAccounts = async () => {
        try {
          const response = await axios.get('/api/dashboard/accounts/list_account', {
            headers: {
              'Content-Type': 'application/json',
              'document_number': userDocumentNumber
            }
          });
          setAccounts(response.data);
        } catch (error) {
          console.error('Error fetching accounts:', error);
          setError(error.message);
        }
      };

      const fetchCards = async () => {
        try {
          const response = await axios.get('/api/dashboard/cards/list_card', {
            headers: {
              'Content-Type': 'application/json',
              'document_number': userDocumentNumber
            }
          });
          setCards(response.data);
        } catch (error) {
          console.error('Error fetching cards:', error);
          setError(error.message);
        }
      };

      fetchTransactions();
      fetchAccounts();
      fetchCards();
      setLoading(false);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchAccountCurrencies = async () => {
      const uniqueIbans = [...new Set(transactions.map(transaction => transaction.account_iban))];
      const currencies = {};

      for (const iban of uniqueIbans) {
        try {
          const response = await axios.get('/api/dashboard/accounts', {
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

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        setOperationType('add');
        setModalTitle('Agregar Dinero');
        setIsAddMoneyModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleMoneyOperation = async () => {
    try {
      if (!selectedAccountForMoney || !amountToAdd || amountToAdd <= 0) {
        alert('Por favor, selecciona una cuenta y añade una cantidad válida');
        return;
      }
  
      let endpoint = '';
      switch (operationType) {
        case 'add':
          endpoint = '/api/dashboard/accounts/add_money';
          break;
        case 'withdraw':
          endpoint = '/api/dashboard/accounts/withdraw_money';
          break;
        case 'hold':
          endpoint = '/api/dashboard/accounts/hold_money';
          break;
        default:
          return;
      }
  
      const response = await axios.post(endpoint, {
        iban: selectedAccountForMoney,
        amount: parseFloat(amountToAdd)
      });
  
      if (response.data.success) {
        setIsAddMoneyModalOpen(false);
        setAmountToAdd('');
        setSelectedAccountForMoney('');
        
        // Refrescar las cuentas
        const accountsResponse = await axios.get('/api/dashboard/accounts/list_account', {
          headers: {
            'Content-Type': 'application/json',
            'document_number': userDocumentNumber
          }
        });
        setAccounts(accountsResponse.data);
        
        // Refrescar las transacciones
        const transactionsResponse = await axios.get('/api/transactions', {
          params: { user_document_number: userDocumentNumber }
        });
        setTransactions(transactionsResponse.data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || `Error al ${operationType === 'add' ? 'agregar' : operationType === 'withdraw' ? 'retirar' : 'retener'} dinero`);
    }
  };

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
        <td className="bg-transparent text-white rounded-lg">
          <a
            onClick={() => router.push(`/dashboard/accounts/details_account?iban=${account.iban}`)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {account.iban}
          </a>
        </td>
        <td className="bg-transparent text-white rounded-lg">{account.available_balance} {getCurrencySymbol(account.currency)}</td>
        <td className="bg-transparent text-white rounded-lg">{new Date(account.opening_date).toLocaleDateString()}</td>
        <td className="bg-transparent text-white rounded-lg">
          <button
            onClick={() => router.push(`/dashboard/accounts/close_account?iban=${account.iban}`)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm transition-colors duration-200"
          >
            Dar de baja
          </button>
        </td>
      </tr>
    ));
  };

  const renderCards = () => {
    return cards.map(card => (
      <tr key={card.card_number} className="bg-transparent">
        <td className="bg-transparent text-white rounded-lg">{card.card_number}</td>
        <td className="bg-transparent text-white rounded-lg">{card.card_type}</td>
        <td className="bg-transparent text-white rounded-lg">{new Date(card.expiration_date).toLocaleDateString()}</td>
        <td className="bg-transparent text-white rounded-lg">{new Date(card.hiring_date).toLocaleDateString()}</td>
        <td className="bg-transparent text-white rounded-lg">{card.ccv}</td>
        <td className="bg-transparent text-white rounded-lg">{card.account_iban}</td>
        <td className="bg-transparent text-white rounded-lg">
          <button
            onClick={() => router.push(`/dashboard/cards/close_card?cardNumber=${card.card_number}`)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm transition-colors duration-200"
          >
            Dar de baja
          </button>
        </td>
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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const AddMoneyModal = () => {
    if (!isAddMoneyModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Operaciones con dinero</h2>
            <button
              onClick={() => setIsAddMoneyModalOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => {
                  setOperationType('add');
                  setModalTitle('Agregar Dinero');
                }}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                  operationType === 'add' ? 'bg-green-500 text-white' : 'bg-slate-700 text-gray-300'
                }`}
              >
                Agregar
              </button>
              <button
                onClick={() => {
                  setOperationType('withdraw');
                  setModalTitle('Retirar Dinero');
                }}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                  operationType === 'withdraw' ? 'bg-red-500 text-white' : 'bg-slate-700 text-gray-300'
                }`}
              >
                Retirar
              </button>
              <button
                onClick={() => {
                  setOperationType('hold');
                  setModalTitle('Retener Dinero');
                }}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                  operationType === 'hold' ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-gray-300'
                }`}
              >
                Retener
              </button>
            </div>
            
            <label className="block text-white text-sm font-bold mb-2">
              Seleccionar Cuenta
            </label>
            <select
              value={selectedAccountForMoney}
              onChange={(e) => setSelectedAccountForMoney(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.map(account => (
                <option key={account.iban} value={account.iban}>
                  {account.iban} - {account.available_balance} {getCurrencySymbol(account.currency)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Cantidad
            </label>
            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddMoneyModalOpen(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleMoneyOperation}
              disabled={!selectedAccountForMoney || !amountToAdd}
              className={`text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                operationType === 'add' ? 'bg-green-500 hover:bg-green-600' :
                operationType === 'withdraw' ? 'bg-red-500 hover:bg-red-600' :
                'bg-yellow-500 hover:bg-yellow-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {operationType === 'add' ? 'Agregar' :
               operationType === 'withdraw' ? 'Retirar' : 'Retener'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6">
      <Header />
      <div className="container max-w-7xl p-8 mt-32 mx-auto px-6 relative z-10 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-8">Inicio</h1>
        <div className="grid gap-8">
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Cuentas</h2>
            <div className="overflow-y-auto max-h-64 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">IBAN</th>
                    <th className="text-white">Saldo</th>
                    <th className="text-white">Fecha de Apertura</th>
                    <th className="text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>{renderAccounts()}</tbody>
              </table>
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Tarjetas</h2>
            <div className="overflow-y-auto max-h-64 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
              <table className="w-full bg-transparent rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="text-white">Número de Tarjeta</th>
                    <th className="text-white">Tipo de Tarjeta</th>
                    <th className="text-white">Fecha de Expiración</th>
                    <th className="text-white">Fecha de Contratación</th>
                    <th className="text-white">CCV</th>
                    <th className="text-white">IBAN de la Cuenta</th>
                    <th className="text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>{renderCards()}</tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Ingresos Recientes</h2>
              <div className="overflow-y-auto max-h-64 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
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
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Gastos Recientes</h2>
              <div className="overflow-y-auto max-h-64 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
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
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Retenidos</h2>
              <div className="overflow-y-auto max-h-64 rounded-lg" style={{ scrollbarColor: 'gray transparent', scrollbarWidth: 'thin' }}>
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
      <AddMoneyModal />
    </div>
  );
};

export default DashboardPage;