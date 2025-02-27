import { useEffect } from 'react';

export default function CustomModal({ isOpen, onClose, title, message }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="container max-h-[80vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}