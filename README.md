<<<<<<< HEAD
# API de Organización de Registros

Node.js + Express + MySQL. Proyecto para la clase de Calidad de Software.

## Instalación
1. `npm install`
2. Copia `.env.example` a `.env` y ajusta tus credenciales de MySQL.
3. `npm run seed`  → crea la BD `registros_db` con 3 tablas (200 categorías, 250 usuarios, 500 registros).
4. `npm start`     → http://localhost:3000

## Endpoints (8)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/registros?page=1&limit=10&estado=pendiente | Lista paginada |
| GET | /api/registros/:id | Detalle |
| POST | /api/registros | Crear |
| PUT | /api/registros/:id | Actualizar |
| DELETE | /api/registros/:id | Eliminar |
| GET | /api/categorias | Listar categorías |
| GET | /api/usuarios | Listar usuarios |
| GET | /api/estadisticas | Registros por estado |

Ejemplo POST:
```json
{ "titulo": "Revisar contrato", "descripcion": "Q4", "estado": "pendiente", "categoria_id": 1, "usuario_id": 1 }
```
=======
# api-trabajo-en-clase-
>>>>>>> 479e6c97c0ee14dbc450a66fa9484c02bec42fc9
