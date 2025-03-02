import React, { useEffect } from 'react';

const CookiesModal = ({ isOpen, onClose, handleAcceptAllCookies, handleAcceptEssentialCookies, handleRejectAllCookies }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose(); // Llamar a la función onClose cuando se presiona Escape
      }
    };
    document.addEventListener('keydown', handleEscape); // Añadir el evento keydown al documento
    return () => {
      document.removeEventListener('keydown', handleEscape); // Limpiar el evento keydown al desmontar el componente
    };
  }, [onClose]); // Dependencia de onClose para actualizar el efecto cuando cambie

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="container max-h-[80vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Política de Cookies</h2>
        <p className="mb-4 text-center">
          Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Puedes aceptar todas las cookies para
          disfrutar de todas las funcionalidades o aceptar solo las cookies esenciales para el funcionamiento básico
          del sitio.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button onClick={handleRejectAllCookies} className="bg-red-500 text-white p-2 rounded-lg">
            Rechazar Todas
          </button>
          <button onClick={handleAcceptEssentialCookies} className="bg-gray-500 text-white p-2 rounded-lg">
            Aceptar Solo Esenciales
          </button>
          <button onClick={handleAcceptAllCookies} className="bg-blue-700 text-white p-2 rounded-lg">
            Aceptar Todas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;