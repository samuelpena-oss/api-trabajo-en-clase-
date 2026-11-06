// Crea las tablas y las llena con datos de prueba:
// 200 categorías, 250 usuarios y 500 registros
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

const temas = ['Finanzas','Ventas','Soporte','Marketing','Logística','Legal','Compras','Calidad','Sistemas','Recursos Humanos'];
const areas = ['Norte','Sur','Este','Oeste','Centro','Regional','Nacional','Interno','Externo','Global'];
const nombres = ['Ana','Luis','María','Carlos','Sofía','Jorge','Laura','Pedro','Camila','Andrés'];
const apellidos = ['Gómez','Pérez','Rodríguez','López','Martínez','Torres','Ramírez','Díaz','Vargas','Castro'];
const estados = ['pendiente','en_progreso','completado'];
const acciones = ['Revisar','Actualizar','Archivar','Aprobar','Documentar','Auditar','Clasificar','Validar'];

const rnd = (n) => Math.floor(Math.random() * n);

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  await conn.query(fs.readFileSync('schema.sql', 'utf8'));
  await conn.query('USE registros_db');

  const categorias = [];
  for (let i = 0; i < 200; i++) {
    categorias.push([`${temas[i % 10]} ${areas[Math.floor(i / 10) % 10]} ${Math.floor(i / 100) + 1}`, `Categoría de ejemplo número ${i + 1}`]);
  }
  await conn.query('INSERT INTO categorias (nombre, descripcion) VALUES ?', [categorias]);

  const usuarios = [];
  for (let i = 0; i < 250; i++) {
    const n = nombres[rnd(10)], a = apellidos[rnd(10)];
    usuarios.push([`${n} ${a}`, `${n}.${a}${i}@ejemplo.com`.toLowerCase(), `pass${1000 + i}`]);
  }
  await conn.query('INSERT INTO usuarios (nombre, email, password) VALUES ?', [usuarios]);

  const registros = [];
  for (let i = 0; i < 500; i++) {
    registros.push([
      `${acciones[rnd(8)]} documento ${i + 1}`,
      `Descripción del registro ${i + 1}`,
      estados[rnd(3)],
      1 + rnd(200),
      1 + rnd(250)
    ]);
  }
  await conn.query('INSERT INTO registros (titulo, descripcion, estado, categoria_id, usuario_id) VALUES ?', [registros]);

  console.log('Base de datos lista: 200 categorías, 250 usuarios, 500 registros.');
  await conn.end();
})().catch((e) => { console.error(e); process.exit(1); });
