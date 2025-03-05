// javilin
// Importar React y el hook useState
import React, { useState } from 'react';

// Componente Header que recibe la cuenta del usuario como prop
const Header = ({ userAccount }) => {
  // Estado para controlar si el menú está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    // Contenedor principal del header con estilos de Tailwind CSS
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      /* Menú desplegable */
      <div className="relative">
        /* Botón para abrir/cerrar el menú */
        <button onClick={toggleMenu} className="focus:outline-none">
          /* Icono del menú (tres líneas horizontales) */
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        /* Contenido del menú desplegable */
        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Inicio</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Servicios</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Contacto</a>
          </div>
        )}
      </div>

      /* Nombre del banco */
      <div className="text-xl font-bold">
        Innovabank
      </div>

      /* Cuenta del usuario */
      <div>
        {userAccount}
      </div>
    </header>
  );
};

// Exportar el componente Header para su uso en otros archivos
export default Header;