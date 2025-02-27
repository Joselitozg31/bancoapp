import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4 mb-16 max-w-2xl">
      <div className="flex justify-between">
        <div className="w-1/2 pr-4">
          <h1 className="text-2xl font-bold mb-4">Contáctanos</h1> {/* Cambiado a español */}
          <form className="space-y-4 mb-8">
            <div>
              <input type="text" id="name" name="name" placeholder="Nombre" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-white" required /> {/* Cambiado a español */}
            </div>
            <div>
              <input type="email" id="email" name="email" placeholder="Correo Electrónico" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-white" required /> {/* Cambiado a español */}
            </div>
            <div>
              <textarea id="message" name="message" rows="4" placeholder="Mensaje" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-white" required></textarea> {/* Cambiado a español */}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Enviar</button> {/* Cambiado a español */}
          </form>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Sobre Nosotros</h2> {/* Cambiado a español */}
          <p className="mb-4">
          ¡Bienvenido a Innova! Nos dedicamos a ofrecer los mejores servicios financieros a nuestros clientes. Nuestra oficina central está situada en el corazón de la ciudad, y siempre estamos aquí para ayudarle con sus necesidades financieras.          </p>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Nuestra Ubicación</h3> {/* Cambiado a español */}
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#f0f0f0' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.383338274839!2d-6.292287684692949!3d36.52706197999867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0dcf5d9f0f0f0f%3A0x0!2zMzZCDTAzJzM0LjciTiA2wrAxNyc0Ni4yIlc!5e0!3m2!1ses!2ses!4v1616161616161!5m2!1ses!2ses"
                width="600"
                height="450"
                style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;