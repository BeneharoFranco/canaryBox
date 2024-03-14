updateTotal();
initializeAddToCartButtons();

function initializeAddToCartButtons() {
    const buttons = document.getElementsByClassName('btn-add');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', addToCartHandler);
    }
}

function getProductName(productElement) {
    // Asumiendo que '.product-wrapper' es una clase única dentro de cada elemento de producto,
    // y que contiene el nombre del producto como su texto.
    var productNameElement = productElement.getElementsByClassName('product-wrapper')[0];
    return productNameElement.innerText.split('\n')[0];
}

function getProductPrice(productElement) {
    // Similarmente, asumiendo que '.product-price' es único dentro de cada elemento de producto
    // y contiene el precio del producto.
    var priceElement = productElement.getElementsByClassName('product-price')[0];
    var priceText = priceElement.innerText.replace('€', '');
    return parseFloat(priceText);
}

function addToCartHandler() {
    const productElement = this.parentNode;
    const productName = getProductName(productElement);
    const price = getProductPrice(productElement);
    const quantityInput = productElement.querySelector('.quantity'); // Obtiene el elemento input directamente
    const quantity = parseInt(quantityInput.value, 10);

    if (isValidQuantity(quantity)) {
        addToCart(productName, price, quantity);
        updateTotal();
        quantityInput.value = 0;
    }
}

function getProductQuantity(productElement) {
    return parseInt(productElement.querySelector('.quantity').value, 10);
}

function isValidQuantity(quantity) {
    return quantity > 0;
}

function addToCart(productName, price, quantity) {
    const cartList = document.getElementsByClassName('listadoCarrito')[0];
    let productInCart = findProductInCart(cartList, productName);

    if (productInCart) {
        updateProductInCart(productInCart, quantity, price);
    } else {
        addNewProductToCart(cartList, productName, quantity, price);
    }
}

function findProductInCart(cartList, productName) {
    let products = cartList.children;
    for (let i = 0; i < products.length; i++) {
        if (products[i].getAttribute('data-product-name') === productName) {
            return products[i];
        }
    }
    return null;
}

function updateProductInCart(productElement, quantity, price) {
    let currentQtyElement = productElement.getElementsByClassName('cart-quantity')[0];
    let currentQty = parseInt(currentQtyElement.innerText);
    let newQty = currentQty + quantity;
    currentQtyElement.innerText = newQty;

    let priceElement = productElement.getElementsByClassName('cart-price')[0];
    priceElement.innerText = `${(newQty * price).toFixed(2)}€`;
}

function addNewProductToCart(cartList, productName, quantity, price) {
    let productElement = document.createElement('div');
    productElement.setAttribute('data-product-name', productName);
    productElement.innerHTML = `
        <span class="cart-product-name">${productName}</span> | 
        <span class="cart-quantity">${quantity}</span> unidades = 
        <span class="cart-price">${(quantity * price).toFixed(2)}€</span>
        <button class="btn-remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
    `;
    cartList.appendChild(productElement);
    addRemoveButtonEventListener(productElement);
}


function addRemoveButtonEventListener(productElement) {
    let removeButton = productElement.getElementsByClassName('btn-remove')[0];
    removeButton.addEventListener('click', function () {
        productElement.remove();
        updateTotal();
    });
}

function updateTotal() {
    const totalElement = document.getElementsByClassName('totalCarrito')[0];
    const cartList = document.getElementsByClassName('listadoCarrito')[0];
    const mensajeCantidadElement = document.getElementsByClassName('mensajeCantidad')[0]; // Obtiene el elemento del mensaje
    let total = 0;

    Array.from(cartList.children).forEach(item => {
        const priceElement = item.getElementsByClassName('cart-price')[0];
        if (priceElement) {
            const priceText = priceElement.innerText.replace('€', '');
            const price = parseFloat(priceText);
            total += price;
        }
    });

    totalElement.innerText = `${total.toFixed(2)}€`;

    // Muestra el mensaje si la cantidad total es mayor de 25
    if (total > 50) {
        mensajeCantidadElement.innerText = 'ENVÍO GRATUITO'; // Actualiza el texto del mensaje
        mensajeCantidadElement.style.display = 'block'; // Asegúrate de que el elemento sea visible
    } else {
        mensajeCantidadElement.innerText = ''; // Limpia el mensaje si el total no supera 25
        mensajeCantidadElement.style.display = 'none'; // Opcional: Esconde el elemento
    }
}
