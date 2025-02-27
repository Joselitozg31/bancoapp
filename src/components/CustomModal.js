import { useEffect } from 'react';

// Componente CustomModal que recibe las propiedades isOpen, onClose, title y message
export default function CustomModal({ isOpen, onClose, title, message }) {
  // useEffect para manejar el evento de cierre del modal al presionar la tecla Escape
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

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Renderizar el modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      {/* Contenedor del modal con estilos para el fondo y la posición */}
      <div className="container max-h-[80vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {/* Título del modal */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {/* Mensaje del modal */}
        <p className="mb-4">{message}</p>
        {/* Botón para cerrar el modal */}
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
          onClick={onClose} // Llamar a la función onClose al hacer clic en el botón
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}