import { Router } from 'express';

import {
    getAllProductos,
    searchProductoById,
    searchByQuery as search,
    createProducto,
    patchProducto,
    deleteProducto,
    getProductosDisponibles,
    getAllCategorias,
    searchCategoriaById,
    createCategoria,
    patchCategoria,
    deleteCategoria,

} from '../controllers/ctrls_productos.js';

const productRouter = Router();

productRouter.get('/productos', (req, res) => {
    getAllProductos(req, res);
})
productRouter.get('/categorias', (req, res) => {
    getAllCategorias(req, res);
})
productRouter.get('/productos/search', search);
productRouter.get('/productos/disponibles',  getProductosDisponibles);
productRouter.get('/productos/:id', searchProductoById);
productRouter.post('/productos/', createProducto);
productRouter.put('/productos/:id', patchProducto);
productRouter.delete('/productos/:id', deleteProducto);
productRouter.get('/categorias/:id', searchCategoriaById);
productRouter.post('/categorias', createCategoria);
productRouter.put('/categorias/:id', patchCategoria);
productRouter.delete('/categorias/:id', deleteCategoria);



export default productRouter;


// ### Listar Categorías

// GET http://localhost:5000/categorias

// ### Obtener una Categoría por ID

// GET http://localhost:5000/categorias/3

// ### Crear una Categoría

// POST http://localhost:5000/categorias
// Content-Type: application/json

// {
//   "nombre": "Videojuegos"
// }

// ### Actualizar una Categoría por ID

// PUT http://localhost:5000/categorias/5
// Content-Type: application/json

// {
//   "nombre": "Electrónica"
// }

// ### Borrar una Categoría por ID

// DELETE http://localhost:5000/categorias/7
