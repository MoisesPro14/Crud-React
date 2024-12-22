import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Habilitar CORS solo desde el frontend específico
const corsOptions = {
	origin: 'http://localhost:5173',
	methods: 'GET, POST, PUT, DELETE',
	allowedHeaders: 'Content-Type',
};

// Usamos la configuración de CORS
app.use(cors(corsOptions));

const PORT = process.env.BACKEND_PORT || 5000;

// Middleware para JSON y archivos estáticos
app.use(express.json());

// Configuración de SQL Server
const dbConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_DATABASE,
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
};

// Ruta para obtener productos desde SQL Server
app.get('/api/data', async (req, res) => {
	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool.request().query('SELECT * FROM listaProducto');
		res.json(result.recordset);
	} catch (error) {
		console.error('Error al conectarse a SQL Server:', error);
		res.status(500).send('Error del servidor');
	}
});

// Nueva ruta para obtener categorías
app.get('/api/categorias', async (req, res) => {
	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool.request().query('SELECT * FROM Categoria');   
		res.json(result.recordset);  
	} catch (error) {
		console.error('Error al conectarse a SQL Server:', error);
		res.status(500).send('Error del servidor');
	}
});

//Agregra Producto
app.post('/api/crearProducto', async (req, res) => {
	const { Nombre, Categoria, Precio, Descripcion } = req.body;
  
	try {
	  const pool = await sql.connect(dbConfig);	 
	  const result = await pool.request()
		.input('Nombre', sql.VarChar(50), Nombre)
		.input('Categoria', sql.Int, Categoria)
		.input('Precio', sql.Decimal(10, 2), Precio)  
		.input('Descripcion', sql.VarChar(sql.MAX), Descripcion)
		.execute('InsertarProducto'); 
  
	  res.status(201).json({ message: 'Producto creado correctamente' });
	} catch (error) {
	  console.error('Error al insertar el producto:', error);
	  res.status(500).send('Error del servidor');
	}
  });
  
// Ruta para actualizar un producto
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Categoria, Precio, Descripcion } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        
        await pool.request()
            .input('id', sql.Int, id)
            .input('Nombre', sql.VarChar(50), Nombre)
            .input('Categoria', sql.Int, Categoria)
            .input('Precio', sql.Decimal(10, 2), Precio)
            .input('Descripcion', sql.VarChar(sql.MAX), Descripcion)
            .execute('ActualizarProducto');

        res.send('Producto actualizado');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error del servidor');
    }
});


//Eliminar Producto
app.delete('/api/eliminar/:id', async (req, res) => {
    const { id } = req.params;   
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .execute('EliminarProducto');
        res.status(200).send("Producto eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send("Error al eliminar el producto");
    }
});



// Servir React en producción
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../build')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../build', 'index.html'));
	});
	}

// Iniciar el servidor
app.listen(PORT, () => {
  	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
