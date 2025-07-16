# Continuación de tarea de API de tienda

## 📌 Descripción

Esta API permite gestionar productos en una tienda virtual. Cada producto puede pertenecer a una **categoría**, lo que permite clasificarlos y consultarlos más fácilmente.

---

## 📦 Modelo de Datos

### Producto

```json
{
  "id": 1,
  "nombre": "Laptop",
  "precio": 599.99,
  "descripcion": "Laptop moderna con 8GB RAM y 256GB SSD",
  "disponible": true,
  "fecha_ingreso": "2025-07-06T14:00:00.000Z",
  "categoriaId": 2
}
```

### Categoría

```json
{
  "id": 2,
  "nombre": "Tecnología"
}
```

---

## 🧩 Nuevas Rutas para Categorías

| Método | Ruta                   | Descripción                        |
|--------|------------------------|------------------------------------|
| GET    | `/categorias`          | Lista todas las categorías         |
| GET    | `/categorias/:id`      | Obtiene una categoría por ID       |
| POST   | `/categorias`          | Crea una nueva categoría           |
| PUT    | `/categorias/:id`      | Edita una categoría existente      |
| DELETE | `/categorias/:id`      | Elimina una categoría por ID       |

---


## ✅ Validaciones importantes

- El nombre de la categoría debe ser obligatorio y único.
- Al crear un producto, `categoriaId` debe existir.
- No se puede eliminar una categoría si tiene productos asignados.

---


[
  { "id": 1, "nombre": "Computadoras de Escritorio" },
  { "id": 2, "nombre": "Computadoras de Portátiles" },
  { "id": 3, "nombre": "Almacenamiento" },
  { "id": 4, "nombre": "Audio" },
  { "id": 5, "nombre": "Telefonía" },
  { "id": 6, "nombre": "Imagen y video" },
  { "id": 7, "nombre": "Hogar inteligente" },
  { "id": 8, "nombre": "Videojuegos" },
  { "id": 9, "nombre": "Accesorios" },
]
