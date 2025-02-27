// Consulta SQL para actualizar la contraseña de un usuario basado en su correo electrónico
export const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';