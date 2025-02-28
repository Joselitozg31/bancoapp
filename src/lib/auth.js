// auth.js
import pool from './database';
import bcrypt from 'bcryptjs'; // Librería para encriptación de contraseñas
import jwt from 'jsonwebtoken'; // Librería para generación y verificación de tokens JWT
import 'dotenv/config'; // Carga las variables de entorno desde un archivo .env

// Función para registrar un nuevo usuario en la base de datos
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

  // Encriptar la contraseña antes de guardarla en la base de datos
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar los datos del usuario en la base de datos
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

  return result.insertId; // Retorna el ID del usuario recién creado
}

// Función para autenticar a un usuario (inicio de sesión)
export async function loginUser(document_number, password) {
  // Buscar el usuario en la base de datos por su número de documento
  const [rows] = await pool.query('SELECT * FROM users WHERE document_number = ?', [document_number]);

  // Verificar si el usuario existe
  if (rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = rows[0];
  // Comparar la contraseña ingresada con la almacenada en la base de datos
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar un token JWT con el ID del usuario y un tiempo de expiración de 1 hora
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Retornar el token y los datos del usuario sin incluir la contraseña
  const { password: _, ...userData } = user;
  return { token, userData };
}

// Función para verificar la autenticación del usuario a través del token almacenado en cookies
export function verifyToken(req) {
  const token = getCookie(req, 'token'); // Obtener el token de las cookies
  if (!token) {
    throw new Error('Token no encontrado');
  }

  try {
    // Verificar el token y retornar el contenido decodificado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

// Función para obtener una cookie específica del request
function getCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
