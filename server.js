const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Definición de los modelos para MongoDB
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
  }]
});

const Cart = mongoose.model('Cart', cartSchema);

// Función para poblar la base de datos con productos de ejemplo
const seedDatabase = async () => {
    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts === 0) {
            const products = [
                { name: "Auriculares inalámbricos", description: "Auriculares con cancelación de ruido.", price: 99.99, stock: 50, category: "Electrónicos", imageUrl: "https://via.placeholder.com/250/007bff/FFFFFF?text=Auriculares" },
                { name: "Mouse Gamer", description: "Mouse de alta precisión con luces LED.", price: 45.50, stock: 75, category: "Electrónicos", imageUrl: "https://via.placeholder.com/250/007bff/FFFFFF?text=Mouse" },
                { name: "Sudadera con capucha", description: "Sudadera de algodón suave, ideal para el día a día.", price: 29.99, stock: 120, category: "Ropa", imageUrl: "https://via.placeholder.com/250/007bff/FFFFFF?text=Sudadera" },
            ];
            await Product.insertMany(products);
            console.log('Base de datos poblada con éxito.');
        } else {
            console.log('La base de datos ya contiene productos.');
        }
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    }
};

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    seedDatabase();
  })
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas de la API para productos (Admin y Cliente)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
});

// Rutas de la API para el carrito
app.get('/api/cart/:cartId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId).populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

app.post('/api/cart/:cartId/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      cart = new Cart({ _id: req.params.cartId, items: [] });
    }
    cart.items.push({ productId, quantity });
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});