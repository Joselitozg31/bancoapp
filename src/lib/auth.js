import pool from './database';
import bcrypt from 'bcryptjs'; // Para encriptar contraseñas
import jwt from 'jsonwebtoken';

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  const {
    document_number,
    first_name,
    last_name,
    birth_date,
    email,
    phone,
    country,
    nationality,
    document_type,
    address,
    password,
  } = userData;

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar el usuario en la base de datos
  const [result] = await pool.query(
    `INSERT INTO users (
      document_number, first_name, last_name, birth_date, email, phone, country, nationality, document_type, address, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      document_number,
      first_name,
      last_name,
      birth_date,
      email,
      phone,
      country,
      nationality,
      document_type,
      address,
      hashedPassword,
    ]
  );

  return result.insertId;
}

// Función para autenticar un usuario (login)
export async function loginUser(document_number, password) {
  // Buscar el usuario por número de documento
  const [rows] = await pool.query('SELECT * FROM users WHERE document_number = ?', [document_number]);

  if (rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = rows[0];

  // Verificar la contraseña
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }

  // Devolver los datos del usuario (sin la contraseña)
  const { password: _, ...userData } = user;
  return userData;
}
// filepath: /c:/Users/fjrod/OneDrive/Escritorio/2º DAW/VSCode/Entorno Cliente/bancoapp/src/lib/auth.js

const secret = process.env.JWT_SECRET;

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido');
  }
}