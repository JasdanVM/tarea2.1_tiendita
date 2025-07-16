import productos from '../local_db/datos_productos.json' with { type: 'json' };
import { hasCategoriaProductos, isCategoriaNombreUnique } from '../models/mdls_productos.js';
import { getProductos, getProductoById, insertProducto, updateProducto, removeProducto } from '../models/mdls_productos.js';
import { getCategorias, getCategoriaById, insertCategoria, updateCategoria, removeCategoria } from '../models/mdls_productos.js';
import { validateProducto, validateCategoria } from '../schemas/producto.schema.js';


// const DB_PATH = path.resolve('./local_db/datos_productos.json');

export const getAllProductos = async (req, res) => {
    try {
        const productosDB = await getProductos();
        res.json(productosDB);

    } catch (error) {
        console.error(error); 
        res.status(400).json({
            message: 'Error al obtener los productos',
        })
    }
}

export const searchProductoById = async (req, res) => {
    const { id } = req.params;
    const producto = await getProductoById(id);
    console.log('Producto:', producto);

    if (!producto) {
        res.status(404).json({
            message: 'No se encontró el producto con el id proporcionado'
        });
    } else if (producto.length === 0) {
        res.status(204).send(); // No content
    } else {
        res.status(200).json(producto);
    }
}

export const searchByQuery = (req, res) => {
    const { nombre, precio } = req.query;
    const precioFomateado = Math.trunc(Number(precio));
    let datosFiltrados = [];

    if (!nombre && !precio) {
        return res.status(400).json({
            message: 'Ingrese al menos un parámetro de búsqueda'
        });
    } else
    if (nombre && precio) {
        if (isNaN(precioFomateado)) {
            return res.status(400).json({
                message: 'El precio debe ser un número válido'
            });
        }
        datosFiltrados = productos.filter(( producto ) => {
            return producto.nombre.toLowerCase().trim().includes(nombre.toLowerCase().trim()) && Math.trunc(producto.precio) === precioFomateado;
        });
        
    } else
    if (nombre && !precio) {
        datosFiltrados = productos.filter(( producto ) => {
            return producto.nombre.toLowerCase().trim().includes(nombre.toLowerCase().trim());
        });

    } else 
    if (precio) {
        if (isNaN(precioFomateado)) {
            return res.status(400).json({
                message: 'El precio debe ser un número válido'
            });
        }
        datosFiltrados = productos.filter(({ precio }) => {
            return Math.trunc(precio) === precioFomateado;
        });
    }
    
    // res.status(400).json({
    //     message: 'No se han proporcionado datos de búsqueda adecuados'
    // });
    
    if (datosFiltrados.length === 0) {
        return res.status(404).json({
            message: 'No se encontraron productos que coincidan con los criterios de búsqueda'
        });
    }

    res.json(datosFiltrados);
    
}

// const guardarProductos = (nuevosProductos) => {
//     fs.writeFileSync(DB_PATH, JSON.stringify(nuevosProductos, null, 2));
// }

// const generarNuevoId = (productos) => {
//     const ids = productos.map(p => p.id);
//     return Math.max(...ids, 0) + 1;
// }

export const createProducto = async (req, res) => {
    const data = req.body;

    const { success, error, data: safeData } = await validateProducto(data);

    if (!success) {
        return res.status(400).json(error); 
    }

    try {
        const response = await insertProducto(safeData);
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Error al ingresar el producto'
        });
    }
};


export const patchProducto = async (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id)

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        })
    }

    const data = req.body

    const { success, error, data: safeData } = await validateProducto(data)

    if (!success) {
        return res.status(400).json(error)
    }

    try {
        const producto = await getProductoById(parsedId);
        if (!producto || producto.length === 0 || producto === undefined) {
            return res.status(404).json({
                message: `El producto con id ${id} no fue encontrado`
            });
        }

        const response = await updateProducto(parsedId, safeData);

        // res.json({
        //     message: 'Producto eliminado correctamente',
        // })
        // res.status(204).send();
        res.json({
            message: 'Producto actualizado correctamente',
            producto: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al actualizar el producto',
        });
    }

}

export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        });
    }

    try {
        const producto = await getProductoById(parsedId);
        if (!producto || producto.length === 0 || producto === undefined) {
            return res.status(404).json({
                message: `El producto con id ${id} no fue encontrado`
            });
        }

        const response = await removeProducto(parsedId);

        // res.json({
        //     message: 'Producto eliminado correctamente',
        // })
        // res.status(204).send();
        res.status(200).json({
            message: 'Producto eliminado correctamente',
            response: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al eliminar el producto',
        });
    }
}

export const getProductosDisponibles = async (req, res) => {
    try {
        const productosDB = await getProductos();
        productosDB = productosDB.filter(producto => producto.disponible === true);
        
        if (productosDisponibles.length === 0) {
            return res.status(404).json({
                message: 'No hay productos disponibles en este momento'
            });
        }

        res.json({
            message: `La cantidad de productos disponibles es: ${productosDisponibles.length}`,
            productos: productosDisponibles
        });

    } catch (error) {
        console.error(error); 
        res.status(400).json({
            message: 'Error al obtener los productos',
        })
    }
}

export const getAllCategorias = async (req, res) => {
    try {
        const categoriasDB = await getCategorias();
        res.json(categoriasDB);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Error al obtener las categorías',
        });
    }
}

export const searchCategoriaById = async (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        });
    }
    try {
        const categoria = await getCategoriaById(parsedId);
        if (!categoria || categoria.length === 0) {
            return res.status(404).json({
                message: 'No existe la categoría con el id proporcionado'
            });
        }
        res.json(categoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar la categoría',
        });
    }
}

export const createCategoria = async (req, res) => {
    const data = req.body

    const { success, error, data: safeData} = validateCategoria(data)

    if (!success) {
        res.status(400).json(error)
    }

    try {

        const unique = await isCategoriaNombreUnique(safeData.nombre);
        if (!unique) {
            return res.status(400).json({
                message: 'El nombre de la categoría debe ser único'
            });
        }

        const response = await insertCategoria(safeData.nombre)

        res.status(201).json(response);

    } catch (error) {
         console.error(error); 
        res.status(400).json({
            message: 'Error al ingresar la categoría'
        })
    }
};


export const patchCategoria = async (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        });
    }

    const data = req.body;

    const { success, error, data: safeData } = validateCategoria(data);

    if (!success) {
        res.status(400).json(error);
    }

    try {
        const categoria = await getCategoriaById(parsedId);
        if (!categoria || categoria.length === 0) {
            return res.status(404).json({
                message: `La categoría con id ${id} no fue encontrada`
            });
        }

        const unique = await isCategoriaNombreUnique(data.nombre);
        if (!unique) {
            return res.status(400).json({
                message: 'El nombre de la categoría debe ser único'
            });
        }

        const response = await updateCategoria(parsedId, safeData.nombre);

        res.json({
            message: 'Categoría actualizada correctamente',
            categoria: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al actualizar la categoría',
        });
    }
}


export const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        });
    }

    try {
        if (await hasCategoriaProductos(parsedId)) {
            return res.status(400).json({
                message: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }

        const response = await removeCategoria(parsedId);
        res.status(200).json({
            message: 'Categoría eliminada correctamente',
            response: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar la categoría',
        });
    }
}