# Clave de errores intencionales (no compartir con quien va a probar)

| # | Ubicación | Error | Tipo | Cómo detectarlo |
|---|-----------|-------|------|-----------------|
| 1 | GET /api/registros | `offset = page * limit` (debería ser `(page-1)*limit`): la página 1 se salta los primeros registros | Lógica | `?page=1&limit=10` no devuelve el id 1 |
| 2 | GET /api/registros | Filtro `estado` concatenado en el SQL → **SQL Injection** | Seguridad | `?estado=' OR '1'='1` |
| 3 | GET /api/registros | `total` devuelve el tamaño de la página, no el total real de registros | Lógica | Comparar con `SELECT COUNT(*)` |
| 4 | GET /api/registros | `limit` sin tope máximo (`?limit=100000`) | Robustez/Rendimiento | Pedir un limit enorme |
| 5 | GET /api/registros/:id | Si no existe responde 200 con `null` en vez de 404 | Códigos HTTP | `/api/registros/99999` |
| 6 | POST /api/registros | No valida `titulo` vacío ni campos obligatorios; falla con 500 si falta `categoria_id` | Validación | Enviar body vacío |
| 7 | POST /api/registros | Responde 200 en vez de 201 | Códigos HTTP | Revisar el status |
| 8 | POST /api/registros | No valida que `estado` sea válido ni que la categoría/usuario existan (error de FK expuesto como 500) | Validación | `categoria_id: 99999` |
| 9 | PUT /api/registros/:id | Si el id no existe responde 200 "actualizado" | Lógica/HTTP | PUT sobre id inexistente |
| 10 | PUT /api/registros/:id | Si falta un campo llega `undefined` y MySQL lanza 500; no soporta actualización parcial | Robustez | Enviar solo `{ "estado": "completado" }` |
| 11 | DELETE /api/registros/:id | Responde "eliminado" aunque no exista (no revisa `affectedRows`) | Lógica/HTTP | DELETE de id inexistente |
| 12 | GET /api/usuarios | Devuelve la columna `password` en texto plano (y las contraseñas se guardan sin hash) | Seguridad | Revisar la respuesta |
| 13 | GET /api/usuarios | Sin paginación y sin autenticación | Rendimiento/Seguridad | Llamar sin credenciales |
| 14 | GET /api/estadisticas | Usa `COUNT(DISTINCT categoria_id)` en vez de `COUNT(*)`: los conteos son incorrectos | Lógica | Comparar con un conteo manual en MySQL |
| 15 | Manejo de errores | El handler global devuelve `err.message` y `err.stack` al cliente | Seguridad | Provocar cualquier error 500 |
| 16 | Esquema | `usuarios.email` sin restricción UNIQUE ni validación de formato | Integridad de datos | Insertar emails repetidos |
| 17 | General | Sin autenticación, sin pruebas automatizadas, sin límites de tasa (rate limit) | Calidad/Seguridad | Revisión general |
