import pool from '../config/db.js'

export const getProductos = async () => {
    const query =  `SELECT 
                        p.id,
                        p.nombre,
                        p.precio,
                        p.descripcion,
                        p.disponible,
                        p.fecha_ingreso,
                        c.nombre as categoria
                        FROM productos p
                        LEFT JOIN categorias c ON p.categoria_id = c.id; `
    
    const [results] = await pool.query(query);

    return results;
}

export const getProductoById = async (id) => {
    const query = `SELECT 
                        p.id,
                        p.nombre,
                        p.precio,
                        p.descripcion,
                        p.disponible,
                        p.fecha_ingreso,
                        c.nombre as categoria
                    FROM productos p
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE p.id = ?;`;

    const [data] = await pool.query(query, [id]); //se previene la inyección SQL

    return data;
}

export const insertProducto = async (producto) => {
    const conn = await pool.getConnection()

    try {
        conn.beginTransaction();

        const { nombre, precio, descripcion, disponible, categoria_id } = producto;
        const query = `INSERT INTO productos
            (nombre, precio, descripcion, disponible, categoria_id)
            VALUES (?, ?, ?, ?, ?);`
        
        await conn.execute(query, [id, nombre, precio, descripcion, disponible, fecha_ingreso, categoria_id]);

        conn.commit();

        return producto;
    } catch (error) {
        await conn.rollback();
        throw error
    } finally {
        conn.release();
    }
}


export const updateProducto = async (id, producto) => {
    const conn = await pool.getConnection();
    try {
        conn.beginTransaction();
        const { nombre, precio, descripcion, disponible, fecha_ingreso, categoria_id } = producto;
        const query = `UPDATE productos
            SET nombre = ?, precio = ?, descripcion = ?, disponible = ?, fecha_ingreso = ?,
            categoria_id = ?
            WHERE id = ?;`;

        await conn.execute(query, [nombre, precio, descripcion, disponible, fecha_ingreso, categoria_id, id]);

        conn.commit();

        return { id, ...producto };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}


export const removeProducto = async (id) => {
    const conn = await pool.getConnection();

    try {
        conn.beginTransaction();

        const query = `DELETE FROM productos WHERE id = ?;`;
        await conn.execute(query, [id]);

        conn.commit();

        return { message: 'Producto eliminado correctamente' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}


export const searchProductosByQuery = async (nombre, precio) => {
    let query = `SELECT 
                    p.id,
                    p.nombre,
                    p.precio,
                    p.descripcion,
                    p.disponible,
                    p.fecha_ingreso,
                    c.nombre AS categoria
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 WHERE 1=1`;
    const params = [];

    if (nombre) {
        query += ` AND LOWER(p.nombre) LIKE ?`;
        params.push(`%${nombre.toLowerCase().trim()}%`);
    }

    if (!isNaN(Number(precio))) {
        query += ` AND FLOOR(p.precio) = ?`;
        params.push(Math.trunc(Number(precio)));
    }

    const [result] = await pool.query(query, params);
    return result;
};


export const getCategorias = async () => {
    const query = `SELECT * FROM categorias;`;
    const [results] = await pool.query(query);
    return results;
}


export const getCategoriaById = async (id) => {
    const query = `SELECT * FROM categorias WHERE id = ?;`;
    const [data] = await pool.query(query, [id]);
    return data;
}


export const insertCategoria = async (nombre) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const query = `
            INSERT INTO categorias (nombre) VALUES (?);
        `;

        const [result] = await conn.execute(query, [nombre]);

        await conn.commit();

        return {
            id: result.insertId,
            nombre
        };

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};


export const updateCategoria = async (id, nombre) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const query = `UPDATE categorias SET nombre = ? WHERE id = ?;`;

        await conn.execute(query, [nombre, id]);

        await conn.commit();

        return { id, nombre };

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};


export const removeCategoria = async (id) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const query = `DELETE FROM categorias WHERE id = ?;`;
        await conn.execute(query, [id]);

        await conn.commit();

        return { message: 'Categoría eliminada correctamente' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}


export const isCategoriaNombreUnique = async (nombre) => {
    const query = `SELECT COUNT(*) AS total FROM categorias WHERE nombre = ?`;
    const [rows] = await pool.query(query, [nombre]);
    return rows[0].total === 0;
};


export const hasCategoriaProductos = async (id) => {
    const query = `SELECT COUNT(*) AS total FROM productos WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0].total > 0;
};

