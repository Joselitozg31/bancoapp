import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const mailjetClient = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

export const POST = async (req, res) => {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  const recoveryCode = uuidv4().slice(0, 8); // Generate a random 8-character code

  try {
    // Send email with Mailjet
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

    // Save the recovery code and email in your database (this is a placeholder)
    // await saveRecoveryCodeToDatabase(email, recoveryCode);

    return new Response(JSON.stringify({ message: 'Recovery code sent', recoveryCode }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error sending email', error: error.message }), { status: 500 });
  }
};