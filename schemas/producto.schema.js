import zod from 'zod';
import pool from '../config/db.js';

const productoSchema = zod.object({
  "nombre": zod.string().min(1, 'El nombre es requerido'),
  "precio": zod.number().positive('El precio debe ser mayor a 0'),
  "descripcion": zod.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  "disponible": zod.boolean().optional().default(true),
  "categoria_id": zod.number()
}).strict();

export const validateProducto = async (producto) => {
  const productoParsed = productoSchema.safeParse(producto);

  if (!productoParsed.success) {
    return productoParsed;
  }

  const categoriaId = productoParsed.data.categoria_id;

  const isCategoria = await getCategoriaById(categoriaId);
  if (!isCategoria || isCategoria.length === 0) {
    return {
      success: false,
      error: {
        issues: [
          {
            path: ['categoria_id'],
            message: 'La categoría especificada no existe',
          }
        ]
      }
    };
  }

  return productoParsed;
};


export const categoriaSchema = zod.object({
  nombre: zod.string().min(1, 'El nombre no puede estar vacío')
});

export const validateCategoria = (categoria) => {
  return categoriaSchema.safeParse(categoria);
}