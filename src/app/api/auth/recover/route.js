import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const mailjetClient = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

export const POST = async (req, res) => {
  const { email } = await req.json(); // Extraer el correo electrónico del cuerpo de la solicitud

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 }); // Validar que el correo electrónico esté presente
  }

  const recoveryCode = uuidv4().slice(0, 8); // Generar un código aleatorio de 8 caracteres

  try {
    // Enviar correo electrónico con Mailjet
    await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL,
            Name: process.env.MAILJET_FROM_NAME,
          },
          To: [
            {
              Email: email,
              Name: 'User',
            },
          ],
          Subject: 'Password Recovery Code',
          TextPart: `Your password recovery code is: ${recoveryCode}`,
          HTMLPart: `<h3>Your password recovery code is: <strong>${recoveryCode}</strong></h3>`,
        },
      ],
    });

    // Guardar el código de recuperación y el correo en tu base de datos (esto es un marcador de posición)
    // await saveRecoveryCodeToDatabase(email, recoveryCode);

    return new Response(JSON.stringify({ message: 'Recovery code sent', recoveryCode }), { status: 200 }); // Devolver una respuesta exitosa
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error sending email', error: error.message }), { status: 500 }); // Devolver un mensaje de error si ocurre una excepción
  }
};