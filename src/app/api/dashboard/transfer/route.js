// filepath: d:\XAMPP\htdocs\DES\Servidor_2425\bancoapp\src\server.js
const express = require('express');
const app = express();
const transferRoutes = require('./app/api/dashboard/transfer/route');

app.use(express.json());

// Usar las rutas definidas en route.js
app.use('/api', transferRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});