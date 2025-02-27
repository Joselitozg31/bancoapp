import { useEffect } from 'react';

// Componente TermsModal que recibe la propiedad onClose para cerrar el modal
export default function TermsModal({ onClose }) {
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

  // Renderizar el modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      {/* Contenedor del modal con estilos para el fondo y la posición */}
      <div className="container max-h-[80vh] overflow-y-auto">
        {/* Título del modal */}
        <h2 className="text-2xl font-bold mb-4">Términos y Condiciones del Banco Innova</h2>
        {/* Contenido del modal con términos y condiciones */}
        <div className="overflow-y-auto max-h-96">
          <h2 className="text-2xl font-semibold mt-4 mb-2">1. Introducción</h2>
          <p className="mb-4">Bienvenido a Innova. Estos Términos y Condiciones rigen el uso de nuestros servicios bancarios y financieros. Al acceder y utilizar nuestros servicios, usted acepta estos términos en su totalidad.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">2. Servicios</h2>
          <p className="mb-4">Innova ofrece una variedad de servicios bancarios, que incluyen cuentas corrientes, cuentas de ahorro, tarjetas de crédito y débito, préstamos, transferencias y otros productos financieros. Los detalles específicos de cada servicio se proporcionan al momento de la contratación.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">3. Apertura de Cuentas</h2>
          <p className="mb-4">Para abrir una cuenta en Innova, los clientes deben proporcionar información precisa y actualizada. Innova se reserva el derecho de aprobar o rechazar solicitudes a su discreción.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">4. Uso de Servicios Bancarios</h2>
          <p className="mb-4">Los clientes deben utilizar los servicios de manera responsable y de acuerdo con la legislación vigente. Cualquier uso indebido o fraudulento de los servicios puede resultar en la suspensión o cancelación de la cuenta.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">5. Seguridad</h2>
          <p className="mb-4">Innova implementa medidas de seguridad para proteger la información y las transacciones de los clientes. Sin embargo, los clientes también deben tomar precauciones para proteger sus credenciales y evitar el acceso no autorizado.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">6. Tarifas y Comisiones</h2>
          <p className="mb-4">Innova puede cobrar tarifas y comisiones por ciertos servicios. Estas tarifas se detallan en la sección de tarifas de nuestro sitio web y pueden actualizarse periódicamente.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">7. Responsabilidad</h2>
          <p className="mb-4">Innova no se hace responsable de las pérdidas o daños derivados del uso de nuestros servicios, a menos que se demuestre negligencia por parte de Innova. Los clientes son responsables de monitorear sus cuentas y notificar de inmediato cualquier actividad sospechosa.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">8. Modificaciones de Términos y Condiciones</h2>
          <p className="mb-4">Innova se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios se comunicarán a través de nuestro sitio web y entrarán en vigor 30 días después de su publicación.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">9. Terminación de Servicios</h2>
          <p className="mb-4">Los clientes pueden cerrar sus cuentas en cualquier momento, notificando a Innova por escrito. Innova también puede cerrar cuentas en caso de incumplimiento de estos términos.</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">10. Ley Aplicable</h2>
          <p className="mb-4">Estos Términos y Condiciones se rigen por las leyes de España. Cualquier disputa se resolverá en los tribunales competentes del país.</p>
        </div>
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