// javilin
// Importar React y el hook useState
import React, { useState, useEffect } from 'react';

// Componente Header que recibe la cuenta del usuario como prop
const Header = ({ userAccount }) => {
  // Estado para controlar si el menú está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [transactionsMenuOpen, setTransactionsMenuOpen] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Función para alternar el estado del menú de usuario
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Función para alternar el estado del submenú de transacciones
  const toggleTransactionsMenu = () => {
    setTransactionsMenuOpen(!transactionsMenuOpen);
  };

  // Cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-button') && !event.target.closest('.menu-content')) {
        setMenuOpen(false);
        setUserMenuOpen(false);
        setTransactionsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="relative">
        <button onClick={toggleMenu} className="focus:outline-none menu-button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10 menu-content">
            <a href="/dashboard/accounts/list_account" className="block px-4 py-2 hover:bg-gray-200">Cuentas</a>
            <a href="/dashboard/cards/list_card" className="block px-4 py-2 hover:bg-gray-200">Tarjetas</a>
            <div className="relative">
              <button onClick={toggleTransactionsMenu} className="block w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none">
                Transacciones
              </button>
              {transactionsMenuOpen && (
                <div className="absolute left-full top-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <a href="/dashboard/transactions/transfer" className="block px-4 py-2 hover:bg-gray-200">Realizar transferencia</a>
                  <a href="/dashboard/transactions/history" className="block px-4 py-2 hover:bg-gray-200">Historial</a>
                </div>
              )}
            </div>
            <a href="/dashboard/insurance" className="block px-4 py-2 hover:bg-gray-200">Seguros</a>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 text-xl font-bold">
        <img src="/innova.png" alt="Logo del banco" className="w-8 h-8 rounded-full" />
        <span>Innova</span>
      </div>
      <div className="relative flex items-center space-x-4">
        <span>{userAccount}</span>
        <button onClick={toggleUserMenu} className="focus:outline-none rounded-full menu-button">
          <img src="/usericon.png" alt="Perfil del usuario" className="w-12 h-12 rounded-full" />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10 menu-content">
            <a href="/dashboard/area_personal" className="block px-4 py-2 hover:bg-gray-200">Área Personal</a>
            <a href="/dashboard/inbox" className="block px-4 py-2 hover:bg-gray-200">Inbox</a>
          </div>
        )}
      </div>
    </header>
  );
};

// Exportar el componente Header para su uso en otros archivos
export default Header;