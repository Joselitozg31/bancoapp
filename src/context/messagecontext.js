'use client';

import React, { createContext, useState, useEffect } from 'react';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Función para obtener mensajes aleatorios del servidor
  const fetchRandomMessage = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      const randomMessage = data[Math.floor(Math.random() * data.length)];
      randomMessage.id = Date.now(); // Asignar un ID único basado en la fecha y hora actual
      setMessages((prevMessages) => {
        const updatedMessages = [randomMessage, ...prevMessages];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      localStorage.setItem('lastMessageTime', Date.now());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Obtener un mensaje aleatorio cada 30 segundos
  useEffect(() => {
    const lastMessageTime = localStorage.getItem('lastMessageTime');
    const now = Date.now();
    const timeSinceLastMessage = lastMessageTime ? now - lastMessageTime : 0;
    const initialDelay = Math.max(30000 - timeSinceLastMessage, 0);

    const initialTimeout = setTimeout(() => {
      fetchRandomMessage();
      const interval = setInterval(fetchRandomMessage, 30000);
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(initialTimeout);
  }, []);

  // Mostrar mensaje de bienvenida solo una vez
  useEffect(() => {
    const welcomeMessageShown = localStorage.getItem('welcomeMessageShown');
    if (!welcomeMessageShown) {
      const welcomeMessage = {
        id: Date.now(),
        subject: 'Bienvenido a Banco Innova',
        body: 'Gracias por unirte a Banco Innova. Estamos aquí para ayudarte con todas tus necesidades financieras.',
      };
      setMessages((prevMessages) => {
        const updatedMessages = [welcomeMessage, ...prevMessages];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      localStorage.setItem('welcomeMessageShown', 'true');
    }
  }, []);

  // Manejar favoritos
  const handleFavorite = (messageId) => {
    const updatedFavorites = favorites.includes(messageId)
      ? favorites.filter((id) => id !== messageId)
      : [...favorites, messageId];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <MessageContext.Provider value={{ messages, favorites, handleFavorite }}>
      {children}
    </MessageContext.Provider>
  );
};