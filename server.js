const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Base de datos simple en memoria
const productos = [
    { id: 1, name: "Reloj Clásico", price: 250, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=RELOJ", category: "Complementos" },
    { id: 2, name: "Pulsera de Cuero", price: 80, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=PULSERA", category: "Complementos" },
    { id: 3, name: "Gemelos de Lujo", price: 150, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=GEMELOS", category: "Complementos" },
    { id: 4, name: "Corbata de Seda", price: 60, image: "https://via.placeholder.com/400x500/0A0A0A/F0F0F0?text=CORBATA", category: "Moda" }
];

let carrito = []; // El carrito estará vacío al inicio

// Middleware para procesar JSON y permitir CORS
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor de e-commerce en funcionamiento!');
});

// Rutas de la tienda
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.get('/api/carrito', (req, res) => {
    res.json(carrito);
});

app.post('/api/carrito', (req, res) => {
  const { productId } = req.body;
  const productToAdd = productos.find(p => p.id == productId);
  if (productToAdd) {
    carrito.push(productToAdd);
    res.status(200).json({ message: 'Producto añadido al carrito con éxito.' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado.' });
  }
});

// --- RUTA DE ADMINISTRACIÓN ---
app.post('/api/admin/productos', (req, res) => {
  const newProduct = req.body;
  const newProductId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
  const productWithId = { ...newProduct, id: newProductId };
  productos.push(productWithId);
  console.log('Nuevo producto añadido:', productWithId);
  res.status(201).json({ message: 'Producto subido con éxito.', product: productWithId });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
