import productos from '../local_db/datos_productos.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('./local_db/datos_productos.json');

export const getDatos = (req, res) => {
    res.json(productos);
}

export const getById = (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
        res.status(400).json({
            message: 'El id debe ser un número'
        })
    }
    const dato = productos.find(({ id }) => {
        return id === parsedId
    })

    if (!dato) {
        return res.status(404).json({ 
            message: `El producto con id ${id} no fué encontrado` 
        });
    }

    res.json(dato);
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

const guardarProductos = (nuevosProductos) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(nuevosProductos, null, 2));
}

const generarNuevoId = (productos) => {
    const ids = productos.map(p => p.id);
    return Math.max(...ids, 0) + 1;
}

export const create = (req, res) => {
    //console.log('REQ BODY:', req.body);

    const nuevoProducto = {
    id: generarNuevoId(productos),
    ...req.body,
    disponible: req.body.disponible !== undefined ? req.body.disponible : true,
    fecha_ingreso: new Date().toISOString()
    };
    
    if (!nuevoProducto.nombre || isNaN(nuevoProducto.precio)) {
        return res.status(400).json({ message: 'Nombre y precio válidos son requeridos' });
    }
    if (nuevoProducto.precio <= 0) {
        return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }
    if (!nuevoProducto.descripcion || nuevoProducto.descripcion.length < 10) {
        return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres' });
    }
    
    productos.push(nuevoProducto);

    guardarProductos(productos);

    res.status(201).json(nuevoProducto);
}

export const updateProducto = (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id)

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        })
    }

    const index = productos.findIndex(({ id }) => id === parsedId);

    if (index === -1) {
        res.status(404).json({
            message: 'La película no se ha encontrado'
        })
    }

    const data = req.body

    if (!data.nombre || data.nombre.lenght == 0 || isNaN(data.precio)) {
        return res.status(400).json({ message: 'Nombre y precio válidos son requeridos' });
    }
    if (data.precio <= 0) {
        return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }
    if (!data.descripcion || data.descripcion.length < 10) {
        return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres' });
    }

    const productoActualizado = {
        id: parsedId,
        ...data,
    };
    productos[index] = productoActualizado;
    guardarProductos(productos);

    res.json({
        message: 'Producto actualizado correctamente',
        producto: productoActualizado
    });


}

export const deleteProducto = (req, res) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El id debe ser un número'
        });
    }

    const index = productos.findIndex(({ id }) => id === parsedId);

    if (index === -1) {
        return res.status(404).json({
            message: `El producto con id ${id} no fue encontrado`
        });
    }

    productos.splice(index, 1);
    guardarProductos(productos);
    res.json({
        message: 'Producto eliminado correctamente',
    })
    res.status(204).send();
}

export const getProductosDisponibles = (req, res) => {
    const { disponibles } = req.params;

    const productosDisponibles = productos.filter(producto => producto.disponible === true);
    
    if (productosDisponibles.length === 0) {
        return res.status(404).json({
            message: 'No hay productos disponibles en este momento'
        });
    }

    res.json({
        message: `La cantidad de productos disponibles es: ${productosDisponibles.length}`,
        productos: productosDisponibles
    });
}