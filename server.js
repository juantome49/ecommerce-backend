const backendURL = 'https://ecommerce-backend-byu5.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Reloj Clásico", price: 250, image: "https://via.placeholder.com/250x250/B38E5A/121212?text=RELOJ" },
        { id: 2, name: "Pulsera de Cuero", price: 80, image: "https://via.placeholder.com/250x250/B38E5A/121212?text=PULSERA" },
        { id: 3, name: "Gemelos de Lujo", price: 150, image: "https://via.placeholder.com/250x250/B38E5A/121212?text=GEMELOS" }
    ];

    const productsContainer = document.getElementById('productos-container');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="btn-add" data-id="${product.id}">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productCard);
    });

    // Añadir el listener a los botones después de que se han creado
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            const quantity = 1; // Por ahora, la cantidad es 1

            // Enviar la solicitud POST al backend
            fetch(`${backendURL}/api/carrito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Muestra un mensaje de éxito
                console.log('Respuesta del backend:', data);
            })
            .catch(error => {
                console.error('Error al agregar producto:', error);
                alert('Hubo un error al añadir el producto al carrito.');
            });
        });
    });
});
