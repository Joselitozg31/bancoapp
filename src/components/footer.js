'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CookiesModal from './CookiesModal';

const Footer = () => {
  const [showCookieModal, setShowCookieModal] = useState(false); // Estado para mostrar u ocultar el modal de cookies

  useEffect(() => {
    const cookiePreference = getCookie('cookiePreference');
    if (!cookiePreference) {
      setShowCookieModal(true); // Mostrar el modal si no hay preferencia de cookies guardada
    }
  }, []);

  const handleAcceptAllCookies = () => {
    setCookie('cookiePreference', 'all', 365); // Guardar preferencia de aceptar todas las cookies
    setShowCookieModal(false); // Ocultar el modal de cookies
  };

  const handleAcceptEssentialCookies = () => {
    setCookie('cookiePreference', 'essential', 365); // Guardar preferencia de aceptar solo las cookies esenciales
    setShowCookieModal(false); // Ocultar el modal de cookies
  };

  const handleRejectAllCookies = () => {
    setCookie('cookiePreference', 'none', 365); // Guardar preferencia de rechazar todas las cookies
    setShowCookieModal(false); // Ocultar el modal de cookies
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6 mt-auto">
      <div className="text-center">
        <div className="mb-4">
          <Link href="/contact" className="mx-2">
            Contacto
          </Link>
          <Link href="#" onClick={() => setShowCookieModal(true)} className="mx-2">
            Política de Cookies
          </Link>
          <Link href="/terms" className="mx-2">
            Términos y Condiciones
          </Link>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Innova. Todos los derechos reservados.
        </div>
      </div>

      <CookiesModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
        handleAcceptAllCookies={handleAcceptAllCookies}
        handleAcceptEssentialCookies={handleAcceptEssentialCookies}
        handleRejectAllCookies={handleRejectAllCookies}
      />
    </footer>
  );
};

export default Footer;