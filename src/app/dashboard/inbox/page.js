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
    
    // Configuración de estilos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 48, 135); // Color azul corporativo
    
    // Título
    doc.text("Mensaje del Banco", 105, 20, { align: "center" });
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 48, 135);
    doc.line(20, 25, 190, 25);
    
    // Detalles del mensaje
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Asunto:", 20, 40);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(message.subject, 20, 50);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Mensaje:", 20, 70);
    
    // Contenido del mensaje con saltos de línea automáticos
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitBody = doc.splitTextToSize(message.body, 170);
    doc.text(splitBody, 20, 80);
    
    // Fecha y hora
    const currentDate = new Date().toLocaleString('es-ES');
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Descargado el: ${currentDate}`, 20, 280);
    
    // Pie de página
    doc.setFont("helvetica", "italic");
    doc.text("Este es un documento generado automáticamente por su banco.", 105, 290, { align: "center" });
    
    // Guardar el PDF
    doc.save(`Mensaje_${message.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
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