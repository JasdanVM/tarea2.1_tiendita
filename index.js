import express from 'express';
import apiRoutes from './routes/rutas_productos.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
        <body style="background-color: #111111; color: #ffffff; padding: 2rem;">
            <h1>API de Gestión de Productos - Bienvenido</h1>
            <p>Consulta <code>/productos</code> para comenzar.</p>
            <p>Para más información, consulte la documentación en el ReadMe en</p>
            <p><a href="https://github.com/JasdanVM/tareaAPI_productos.git" style="color: #4ea1f3;">https://github.com/JasdanVM/tareaAPI_productos.git</a></p>
        </body>
    `);
});

//rutas de la API
app.use('/', apiRoutes);

app.use((req, res) => {
    res.status(404).json(
        {
            error: 404,
            message: `url ${req.url} no encontrada`
        }
    )
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})