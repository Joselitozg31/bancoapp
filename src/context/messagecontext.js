'use client';

import React, { createContext, useState, useEffect } from 'react';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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

      // Mostrar notificación
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Nuevo mensaje', {
            body: randomMessage.body,
            icon: '/icon.png',
            badge: '/badge.png'
          });
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Solicitar permiso para notificaciones
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permiso para notificaciones concedido');
        } else {
          console.log('Permiso para notificaciones denegado');
        }
      });
    }
  }, []);

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