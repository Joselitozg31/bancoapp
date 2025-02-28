import { NextResponse } from 'next/server';

// Simulación de mensajes
const messages = [
  {
    id: 1,
    subject: 'Bienvenido a Banco Innova',
    body: 'Gracias por unirte a Banco Innova. Estamos aquí para ayudarte con todas tus necesidades financieras.',
    logo: '/innova.png',
  },
  {
    id: 2,
    subject: 'Actualización de Seguridad',
    body: 'Hemos actualizado nuestras políticas de seguridad para proteger mejor tu información.',
    logo: '/innova.png',
  },
  {
    id: 3,
    subject: 'Nueva Tarjeta de Crédito Disponible',
    body: 'Te ofrecemos una nueva tarjeta de crédito con beneficios exclusivos. ¡Solicítala ahora!',
    logo: '/innova.png',
  },
  {
    id: 4,
    subject: 'Promoción Especial',
    body: 'Aprovecha nuestra promoción especial y obtén un descuento en tus tarifas bancarias.',
    logo: '/innova.png',
  },
  {
    id: 5,
    subject: 'Consejos de Ahorro',
    body: 'Descubre nuestros mejores consejos para ahorrar dinero y gestionar tus finanzas.',
    logo: '/innova.png',
  },
  {
    id: 6,
    subject: 'Actualización de la App',
    body: 'Hemos lanzado una nueva actualización de nuestra app móvil con nuevas funcionalidades.',
    logo: '/innova.png',
  },
  {
    id: 7,
    subject: 'Nuevo Servicio de Atención al Cliente',
    body: 'Ahora puedes contactarnos 24/7 a través de nuestro nuevo servicio de atención al cliente.',
    logo: '/innova.png',
  },
  {
    id: 8,
    subject: 'Inversión Inteligente',
    body: 'Aprende cómo invertir de manera inteligente con nuestros nuevos productos de inversión.',
    logo: '/innova.png',
  },
  {
    id: 9,
    subject: 'Protección de Datos',
    body: 'Tu privacidad es importante para nosotros. Lee nuestra nueva política de protección de datos.',
    logo: '/innova.png',
  },
  {
    id: 10,
    subject: 'Recompensas por Fidelidad',
    body: 'Gana recompensas por ser un cliente fiel de Banco Innova. ¡Descubre cómo!',
    logo: '/innova.png',
  },
  {
    id: 11,
    subject: 'Nuevas Funcionalidades',
    body: 'Hemos añadido nuevas funcionalidades a nuestra plataforma para mejorar tu experiencia.',
    logo: '/innova.png',
  },
  {
    id: 12,
    subject: 'Cambio en las Tarifas',
    body: 'Hemos realizado cambios en nuestras tarifas. Consulta nuestra web para más detalles.',
    logo: '/innova.png',
  },
  {
    id: 13,
    subject: 'Evento Exclusivo',
    body: 'Te invitamos a un evento exclusivo para nuestros clientes más valiosos.',
    logo: '/innova.png',
  },
  {
    id: 14,
    subject: 'Actualización de Política',
    body: 'Hemos actualizado nuestra política de privacidad. Por favor, revísala en nuestra web.',
    logo: '/innova.png',
  },
  {
    id: 15,
    subject: 'Nuevo Producto',
    body: 'Descubre nuestro nuevo producto financiero diseñado para ti.',
    logo: '/innova.png',
  },
  {
    id: 16,
    subject: 'Cámbiate a BBVA',
    body: 'Descubre las ventajas de ser cliente de BBVA. ¡Cámbiate ahora!',
    logo: '/bbva.png',
  },
  {
    id: 17,
    subject: 'Cámbiate a Santander',
    body: 'Descubre las ventajas de ser cliente de Santander. ¡Cámbiate ahora!',
    logo: '/santander.png',
  },
];

// Función para manejar la solicitud GET
export async function GET() {
  // Obtener un mensaje aleatorio (excluyendo el mensaje de bienvenida)
  const randomMessages = messages.filter(message => message.id !== 1);
  const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];

  return NextResponse.json([randomMessage]);
}