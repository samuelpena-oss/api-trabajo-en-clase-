require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// ---------- Registros ----------

// Listar registros (paginación y filtro por estado)
app.get('/api/registros', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const estado = req.query.estado;
    const offset = page * limit;

    let sql = 'SELECT * FROM registros';
    if (estado) {
      sql += ` WHERE estado = '${estado}'`;
    }
    sql += ` ORDER BY id LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.query(sql);
    res.json({ page, limit, total: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

// Obtener un registro por id
app.get('/api/registros/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM registros WHERE id = ?', [req.params.id]);
    res.json({ data: rows[0] || null });
  } catch (err) {
    next(err);
  }
});

// Crear registro
app.post('/api/registros', async (req, res, next) => {
  try {
    const { titulo, descripcion, estado, categoria_id, usuario_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO registros (titulo, descripcion, estado, categoria_id, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [titulo, descripcion || null, estado || 'pendiente', categoria_id, usuario_id]
    );
    res.json({ mensaje: 'Registro creado', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

// Actualizar registro
app.put('/api/registros/:id', async (req, res, next) => {
  try {
    const { titulo, descripcion, estado, categoria_id } = req.body;
    await db.query(
      'UPDATE registros SET titulo = ?, descripcion = ?, estado = ?, categoria_id = ? WHERE id = ?',
      [titulo, descripcion, estado, categoria_id, req.params.id]
    );
    res.json({ mensaje: 'Registro actualizado' });
  } catch (err) {
    next(err);
  }
});

// Eliminar registro
app.delete('/api/registros/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM registros WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Registro eliminado' });
  } catch (err) {
    next(err);
  }
});

// ---------- Categorías ----------

app.get('/api/categorias', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

// ---------- Usuarios ----------

app.get('/api/usuarios', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

// ---------- Estadísticas ----------

app.get('/api/estadisticas', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT estado, COUNT(DISTINCT categoria_id) AS cantidad FROM registros GROUP BY estado'
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// ---------- Manejo de errores ----------

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message, detalle: err.stack });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
