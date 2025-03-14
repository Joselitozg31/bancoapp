'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import CustomModal from '@/components/CustomModal';

const InsurancePage = () => {
  const [selectedInsurances, setSelectedInsurances] = useState({
    medico: false,
    coche: false,
    animal: false,
  });
  const [userData, setUserData] = useState(null);
  const [contractedInsurances, setContractedInsurances] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => {
    const fetchUserData = () => {
      const data = JSON.parse(localStorage.getItem('user'));
      setUserData(data);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchContractedInsurances = async () => {
      if (userData && selectedAccount) {
        try {
          const response = await fetch('/api/insurance/contracted', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userDocumentNumber: userData.document_number,
              accountIban: selectedAccount,
            }),
          });

          const result = await response.json();
          if (response.ok) {
            setContractedInsurances(result.insurances);
          } else {
            console.error('Error: ' + result.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchContractedInsurances();
  }, [userData, selectedAccount]);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      if (userData) {
        try {
          const response = await fetch('/api/dashboard/accounts/list_account', {
            method: 'GET',
            headers: {
              'document_number': userData.document_number,
            },
          });

          const accounts = await response.json();
          if (response.ok) {
            setUserAccounts(accounts);
            if (accounts.length > 0) {
              setSelectedAccount(accounts[0].iban);
            }
          } else {
            console.error('Error: ' + accounts.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchUserAccounts();
  }, [userData]);

  const handleSelect = (insurance) => {
    setSelectedInsurances((prevState) => ({
      ...prevState,
      [insurance]: !prevState[insurance],
    }));
  };

  const handleContratar = async () => {
    if (!userData) {
      setModalMessage('Error: No se pudo obtener los datos del usuario');
      setIsModalOpen(true);
      return;
    }

    if (!selectedAccount) {
      setModalMessage('Error: Debes seleccionar una cuenta');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/insurance/contratar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedInsurances,
          userDocumentNumber: userData.document_number,
          accountIban: selectedAccount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage('Seguros contratados');
        setIsModalOpen(true);
        window.location.reload();
      } else {
        setModalMessage('Error: ' + result.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Error al contratar seguros');
      setIsModalOpen(true);
    }
  };

  const handleDarDeBaja = async () => {
    if (!userData) {
      setModalMessage('Error: No se pudo obtener los datos del usuario');
      setIsModalOpen(true);
      return;
    }

    if (!selectedAccount) {
      setModalMessage('Error: Debes seleccionar una cuenta');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/insurance/dar_de_baja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedInsurances,
          userDocumentNumber: userData.document_number,
          accountIban: selectedAccount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage('Seguros dados de baja');
        setIsModalOpen(true);
        window.location.reload();
      } else {
        setModalMessage('Error: ' + result.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Error al dar de baja seguros');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isAnyInsuranceSelected = Object.values(selectedInsurances).some(value => value);

  return (
    <div className="min-h-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6">
      <Header />
    <div className="container mx-auto p-4 mb-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Contrata nuestros mejores seguros</h1>
      
      {userAccounts.length > 0 ? (
        <div className="mb-6">
          <label htmlFor="account-select" className="block text-sm font-medium mb-2">
            Selecciona una cuenta:
          </label>
          <select
            id="account-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-800 border border-gray-300 text-white"
            style={{ color: 'white' }}
          >
            {userAccounts.map((account) => (
              <option 
                key={account.iban} 
                value={account.iban}
                className="bg-slate-800 text-white"
                style={{ backgroundColor: '#1e293b', color: 'white' }}
              >
                {account.iban} - Saldo: {account.balance}€
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-white">
            Debes tener al menos una cuenta bancaria para contratar seguros.
            Por favor, crea una cuenta primero.
          </p>
        </div>
      )}
      <div className="space-y-4 mb-8">
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${selectedInsurances.medico ? 'bg-green-500 text-white border-green-700' : contractedInsurances.includes(1) ? 'bg-yellow-500 text-white border-yellow-700' : 'bg-white/10 border-gray-300 text-white'} border-2`}
          onClick={() => handleSelect('medico')}
        >
          <h2 className="text-xl font-bold mb-2">Seguro Médico</h2>
          <p>Beneficios: Cobertura médica completa, acceso a especialistas, hospitalización, y más.</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${selectedInsurances.coche ? 'bg-green-500 text-white border-green-700' : contractedInsurances.includes(2) ? 'bg-yellow-500 text-white border-yellow-700' : 'bg-white/10 border-gray-300 text-white'} border-2`}
          onClick={() => handleSelect('coche')}
        >
          <h2 className="text-xl font-bold mb-2">Seguro de Coche</h2>
          <p>Beneficios: Cobertura total de accidentes, asistencia en carretera, reparación de daños, y más.</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${selectedInsurances.animal ? 'bg-green-500 text-white border-green-700' : contractedInsurances.includes(3) ? 'bg-yellow-500 text-white border-yellow-700' : 'bg-white/10 border-gray-300 text-white'} border-2`}
          onClick={() => handleSelect('animal')}
        >
          <h2 className="text-xl font-bold mb-2">Seguro de Animal</h2>
          <p>Beneficios: Cobertura veterinaria, vacunas, tratamientos, y más.</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleContratar}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${!isAnyInsuranceSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isAnyInsuranceSelected}
          >
            Contratar
          </button>
          <button
            type="button"
            onClick={handleDarDeBaja}
            className={`bg-red-500 text-white px-4 py-2 rounded-md ${!isAnyInsuranceSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isAnyInsuranceSelected}
          >
            Dar de Baja
          </button>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Mensaje"
        message={modalMessage}
      />
    </div>
    </div>
  );
};

export default InsurancePage;