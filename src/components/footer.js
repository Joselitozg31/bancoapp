'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [showCookieModal, setShowCookieModal] = useState(false); // Estado para mostrar u ocultar el modal de cookies

  const handleAcceptAllCookies = () => {
    // Lógica para aceptar todas las cookies
    setShowCookieModal(false); // Ocultar el modal de cookies
  };

  const handleAcceptEssentialCookies = () => {
    // Lógica para aceptar solo las cookies esenciales
    setShowCookieModal(false); // Ocultar el modal de cookies
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6 mt-auto">
      <div className="text-center">
        <div className="mb-4">
          <Link href="/contact" className="mx-2">
            Contacto
          </Link>
          <button onClick={() => setShowCookieModal(true)} className="mx-2">
            Política de Cookies
          </button>
          <Link href="/terms" className="mx-2">
            Términos y Condiciones
          </Link>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Innova. Todos los derechos reservados.
        </div>
      </div>

      {showCookieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Política de Cookies</h2>
            <p className="mb-4">
              Utilizamos cookies para mejorar tu experiencia. Puedes aceptar todas las cookies o solo las esenciales.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleAcceptEssentialCookies} className="bg-gray-500 text-white p-2 rounded-lg">
                Aceptar Solo Esenciales
              </button>
              <button onClick={handleAcceptAllCookies} className="bg-blue-700 text-white p-2 rounded-lg">
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;