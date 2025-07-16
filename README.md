# tarea2.1_tiendita_docker
API RESTful que utiliza Node.js y Express, para gestionar un listado de productos y categorías en una base de datos MySQL.

Tarea de Jason Daniel Velásquez Mejía - 20212000937  
Para la clase de Diseño Digital, sección 1700, Ing. Juan Enrique Alvarenga Rodas

# API de Gestión de Productos

## Instalación de dependencias

Clona el repositorio y accede al directorio del proyecto:

`git clone https://github.com/JasdanVM/tareaAPI_productos.git`

`cd tareaapi`

Instala las dependencias ejecutando:

`npm install`
`npm install express`
`npm install dotenv`
`npm install mysql2`
`npm install zod`

Instalar el esquema de la base de datos para Docker
Configurar las credenciales de base de datos en un archivo `.env`:

DB_HOST=localhost
DB_PORT=3308
DB_NAME=tienda
DB_USER=unah
DB_PASSWORD=unah1234
PORT=5000


## Ejecución de la API

En el directorio del proyecto se puede utilizar los comandos de terminal
- `npm start`
- `node index.js`

La API estará disponible en:  
http://localhost:5000

## Rutas disponibles

| Método | Ruta                         | Descripción                                                                      |
|--------|------------------------------|----------------------------------------------------------------------------------|
| GET    | /productos/                  | Muestra todos los productos.                                                    |
| GET    | /productos/:id               | Retorna un producto específico por su ID.                                       |
| POST   | /productos/                  | Crea un nuevo producto.                                                         |
| PUT    | /productos/:id               | Actualiza los datos de un producto existente.                                   |
| DELETE | /productos/:id               | Elimina un producto por ID.                                                     |
| GET    | /productos/disponibles       | Muestra todos los productos disponibles.                                        |
| GET    | /productos/search            | Busca productos por nombre y/o precio.   //TODO: ENLAZAR A BASE DE DATOS        |
| GET    | /categorias/                 | Muestra todas las categorías.                                                   |
| GET    | /categorias/:id              | Retorna una categoría específica por su ID.                                     |
| POST   | /categorias/                 | Crea una nueva categoría.                                                       |
| PUT    | /categorias/:id              | Edita una categoría existente.                                                  |
| DELETE | /categorias/:id              | Elimina una categoría (solo si no tiene productos asociados).                   |

Al crear o actualizar un producto se hacen las siguientes validaciones:
- Debe tener las propiedades de nombre, precio, descripción y categoría.
- El precio debe ser un número mayor a 0.
- La descripción debe tener al menos 10 caracteres.
- La categoría debe existir previamente.

Al crear, editar, o eliminar una categoría:
- El nombre no debe estar vacío.
- El nombre debe ser único.
- No se puede eliminar una categoría si tiene productos asignados
