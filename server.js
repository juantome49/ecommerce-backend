const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Base de datos simple en memoria
const productos = [
    { id: 1, name: "Reloj Clásico", price: 250, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=RELOJ" },
    { id: 2, name: "Pulsera de Cuero", price: 80, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=PULSERA" },
    { id: 3, name: "Gemelos de Lujo", price: 150, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=GEMELOS" },
    { id: 4, name: "Corbata de Seda", price: 60, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=CORBATA" }
];

let carrito = []; // El carrito estará vacío al inicio

// Middleware para procesar JSON y permitir CORS
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor de e-commerce en funcionamiento!');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// Ruta para agregar un producto al carrito
app.post('/api/carrito', (req, res) => {
  const { productId } = req.body;
  const productToAdd = productos.find(p => p.id == productId);

  if (productToAdd) {
    carrito.push(productToAdd);
    console.log(`Producto con ID ${productId} añadido. Carrito actual:`, carrito);
    res.status(200).json({ 
        message: 'Producto añadido al carrito con éxito.',
        cartCount: carrito.length
    });
  } else {
    res.status(404).json({ message: 'Producto no encontrado.' });
  }
});

// Ruta para obtener el contenido del carrito
app.get('/api/carrito', (req, res) => {
    res.json(carrito);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
