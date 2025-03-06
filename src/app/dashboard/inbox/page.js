'use client';
import React, { useContext, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { MessageContext } from '@/context/messagecontext';
import Header from '@/components/header';

const InboxPage = () => {
  const { messages, favorites, handleFavorite, setMessages } = useContext(MessageContext);

  // Descargar mensaje en PDF
  const handleDownload = (message) => {
    const doc = new jsPDF();
    doc.text(`Asunto: ${message.subject}`, 10, 10);
    doc.text(`Mensaje: ${message.body}`, 10, 20);
    doc.save(`${message.subject}.pdf`);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white py-6">
      <Header/>
      <div className="container max-w-3xl p-8 mt-16"> 
        <h1 className="text-3xl font-bold mb-6">Bandeja de Entrada</h1>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-center p-4 bg-white/10 shadow-md rounded-lg">
              <img src={message.logo} alt="Banco Logo" className="w-12 h-12 mr-4 rounded-full" />
              <div className="flex-grow">
                <h2 className="text-xl font-bold">{message.subject}</h2>
                <p>{message.body}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleFavorite(message.id)}
                  className={`p-2 rounded-full ${favorites.includes(message.id) ? 'text-yellow-500' : 'text-white'}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
                  </svg>
                </button>
                <button onClick={() => handleDownload(message)} className="p-2 rounded-full text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 16l4-4H8l4 4zm0-12v8h-2V4h2zm-6 14h12v2H6v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;