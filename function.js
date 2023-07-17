function isUserLoggedIn() {
  // Verifica si el valor almacenado en 'isLoggedIn' en el almacenamiento local es igual a 'true'
  return localStorage.getItem('isLoggedIn') === 'true';
}

function toggleSessionElements() {
  // Obtiene los elementos del DOM relacionados con la sesión del usuario
  const loginContainer = document.getElementById('loginContainer');
  const productContainer = document.getElementById('productContainer');
  const cartContainer = document.getElementById('cartContainer');
  const logoutButton = document.getElementById('logoutButton');

  if (isUserLoggedIn()) {
    // Si el usuario ha iniciado sesión, muestra los elementos relacionados con la sesión y carga el carrito
    loginContainer.style.display = 'none';
    productContainer.style.display = 'block';
    cartContainer.style.display = 'block';
    logoutButton.style.display = 'block';
    loadCartFromLocalStorage();
  } else {
    // Si el usuario no ha iniciado sesión, muestra los elementos de inicio de sesión y oculta los demás
    loginContainer.style.display = 'block';
    productContainer.style.display = 'none';
    cartContainer.style.display = 'none';
    logoutButton.style.display = 'none';
  }
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  // Previene el envío del formulario y realiza el proceso de inicio de sesión
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'Alexander' && password === '1234') {
    // Si las credenciales son correctas, muestra un mensaje de inicio de sesión exitoso y muestra la tabla de productos
    showModal('Inicio de sesión exitoso');
    showProductTable();
  } else {
    // Si las credenciales son incorrectas, muestra un mensaje de error
    showModal('Usuario o contraseña incorrectos');
  }
});

const cartItems = [];

function addToCart(id, name, price, quantity) {
  // Agrega un producto al carrito de compras
  let existingItem = cartItems.find(item => item.id === id);
  if (existingItem) {
    // Si el producto ya existe en el carrito, incrementa la cantidad
    existingItem.quantity += quantity;
  } else {
    // Si el producto no existe en el carrito, crea un nuevo elemento
    const newItem = {
      id: id,
      name: name,
      price: price,
      quantity: quantity
    };
    cartItems.push(newItem);
  }

  // Guarda el carrito en el almacenamiento local y muestra el carrito actualizado
  saveCartToLocalStorage();
  showCart();
  showModal('Producto agregado: ' + name + '\nCantidad: ' + quantity);
}

function showCart() {
  // Muestra los elementos del carrito en la tabla correspondiente
  const cartTableBody = document.getElementById('cartTableBody');
  cartTableBody.innerHTML = '';

  cartItems.forEach(function(item) {
    // Crea las filas y celdas de la tabla para cada producto en el carrito
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = item.id;
    row.appendChild(idCell);

    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = item.price;
    row.appendChild(priceCell);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;
    row.appendChild(quantityCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = item.price * item.quantity;
    row.appendChild(totalCell);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', function() {
      // Maneja el evento de clic en el botón de eliminar para remover el producto del carrito
      removeCartItem(item.id);
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    cartTableBody.appendChild(row);
  });
}

function showModal(message) {
  // Muestra un modal con el mensaje especificado
  const modal = document.getElementById('myModal');
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.innerHTML = message;

  modal.style.display = 'block';

  const closeButton = modal.getElementsByClassName('close')[0];
  closeButton.onclick = function() {
    // Maneja el evento de clic en el botón de cerrar para ocultar el modal
    modal.style.display = 'none';
  };

  const modalCloseButton = modal.getElementsByClassName('modal-close')[0];
  modalCloseButton.onclick = function() {
    // Maneja el evento de clic en el botón de cerrar para ocultar el modal
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    // Maneja el evento de clic en cualquier parte fuera del modal para ocultarlo
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

document.getElementById('payButton').addEventListener('click', function() {
  // Maneja el evento de clic en el botón de pagar
  const total = calculateTotal();
  const cartContent = getCartContent();
  showModal('Compra exitosa<br><br>' + cartContent + '<br>Total: ' + total);

  // Limpiar el carrito de compra
  cartItems.length = 0;
  saveCartToLocalStorage();
  showCart();
});

function calculateTotal() {
  // Calcula el total de la compra sumando el precio de cada producto multiplicado por la cantidad
  let total = 0;
  for (let i = 0; i < cartItems.length; i++) {
    total += cartItems[i].price * cartItems[i].quantity;
  }
  return total;
}

function getCartContent() {
  // Obtiene el contenido del carrito en formato legible
  let content = '';
  for (let i = 0; i < cartItems.length; i++) {
    content += 'Producto: ' + cartItems[i].name + '<br>';
    content += 'Cantidad: ' + cartItems[i].quantity + '<br>';
    content += 'Precio unitario: ' + cartItems[i].price + '<br>';
    content += 'Subtotal: ' + cartItems[i].price * cartItems[i].quantity + '<br><br>';
  }
  return content;
}

function saveCartToLocalStorage() {
  // Guarda los elementos del carrito en el almacenamiento local como una cadena JSON
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
  // Carga los elementos del carrito desde el almacenamiento local y muestra el carrito
  const savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems) {
    cartItems.push(...JSON.parse(savedCartItems));
    showCart();
  }
}

function showProductTable() {
  // Muestra la tabla de productos y oculta los elementos de inicio de sesión
  const loginContainer = document.getElementById('loginContainer');
  const productContainer = document.getElementById('productContainer');
  const cartContainer = document.getElementById('cartContainer');

  loginContainer.style.display = 'none';
  productContainer.style.display = 'block';
  cartContainer.style.display = 'block';

  const productTableBody = document.getElementById('productTableBody');

  // Realiza una solicitud HTTP para obtener los datos de productos
  fetch('dummyApi/data.json')
    .then(response => response.json())
    .then(data => {
      const productos = data.productos;
      productos.forEach(producto => {
        // Crea filas en la tabla con los datos de los productos obtenidos
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        const nombreCell = document.createElement('td');
        const precioCell = document.createElement('td');
        const addButtonCell = document.createElement('td');
        const addButton = document.createElement('button');

        idCell.textContent = producto.id;
        nombreCell.textContent = producto.nombre;
        precioCell.textContent = '$' + producto.precio.toFixed(2);
        addButton.textContent = 'Agregar';

        addButton.addEventListener('click', function() {
          // Muestra un modal para ingresar la cantidad y agregar el producto al carrito
          showModalForQuantity(producto.id, producto.nombre, producto.precio);
        });

        row.appendChild(idCell);
        row.appendChild(nombreCell);
        row.appendChild(precioCell);
        addButtonCell.appendChild(addButton);
        row.appendChild(addButtonCell);

        productTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.log('Error al obtener los datos del archivo JSON:', error);
    });

  loadCartFromLocalStorage();
}

function showModalForQuantity(id, name, price) {
  // Muestra un modal para ingresar la cantidad de un producto a agregar al carrito
  const quantityModal = document.getElementById('quantityModal');
  const quantityInput = document.getElementById('quantityInput');
  const quantityButton = document.getElementById('quantityButton');

  quantityInput.value = '';
  quantityButton.onclick = function() {
    const quantity = parseInt(quantityInput.value);
    if (!isNaN(quantity) && quantity > 0) {
      // Si la cantidad es válida, agrega el producto al carrito y oculta el modal
      addToCart(id, name, price, quantity);
      quantityModal.style.display = 'none';
    } else {
      // Si la cantidad no es válida, muestra un mensaje de error
      showModal('Ingrese una cantidad válida.');
    }
  };

  quantityModal.style.display = 'block';
}

function removeCartItem(id) {
  // Remueve un producto del carrito según su identificador
  cartItems.splice(cartItems.findIndex(item => item.id === id), 1);
  saveCartToLocalStorage();
  showCart();
}

window.addEventListener('load', function() {
  // Carga los elementos del carrito, muestra u oculta los elementos de sesión según el estado de inicio de sesión y muestra un mensaje de bienvenida
  loadCartFromLocalStorage();
  toggleSessionElements();

  showModal('¡Bienvenido! Por favor, inicia sesión.');

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function() {
    // Maneja el evento de clic en el botón de cerrar sesión
    localStorage.setItem('isLoggedIn', 'false');
    toggleSessionElements();
    cartItems.length = 0;
    saveCartToLocalStorage();
  });
});
