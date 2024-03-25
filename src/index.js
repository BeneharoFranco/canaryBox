updateTotal();
initializeAddToCartButtons();

function initializeAddToCartButtons() {
    const buttons = document.getElementsByClassName('btn-add');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', addToCartHandler);
    }
}

function getProductName(productElement) {
    var productNameElement = productElement.getElementsByClassName('product-wrapper')[0];
    return productNameElement.innerText.split('\n')[0];
}

function getProductPrice(productElement) {
    var priceElement = productElement.getElementsByClassName('product-price')[0];
    var priceText = priceElement.innerText.replace('€', '');
    return parseFloat(priceText);
}

function addToCartHandler() {
    const productElement = this.parentNode;
    const productName = getProductName(productElement);
    const price = getProductPrice(productElement);
    const quantityInputs = productElement.getElementsByClassName('quantity');
    const quantityInput = quantityInputs.length > 0 ? quantityInputs[0] : null; 
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;

    if (isValidQuantity(quantity)) {
        addToCart(productName, price, quantity);
        updateTotal();
        if (quantityInput) quantityInput.value = 0;
    }
}


function getProductQuantity(productElement) {
    const quantityInputs = productElement.getElementsByClassName('quantity');
    const quantityInput = quantityInputs[0];
    return parseInt(quantityInput.value, 10);
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
    const mensajeCantidadElement = document.getElementsByClassName('mensajeCantidad')[0];
    let total = 0;

    for (let i = 0; i < cartList.children.length; i++) {
        const item = cartList.children[i];
        const priceElement = item.getElementsByClassName('cart-price')[0];
        if (priceElement) {
            const priceText = priceElement.innerText.replace('€', '');
            const price = parseFloat(priceText);
            total += price;
        }
    }

    totalElement.innerText = `${total.toFixed(2)}€`;

    // Muestra el mensaje según el total calculado, envío gratuito
    if (total > 50) {
        mensajeCantidadElement.innerText = 'ENVÍO GRATUITO';
        mensajeCantidadElement.style.display = 'block';
    } else {
        mensajeCantidadElement.innerText = '';
        mensajeCantidadElement.style.display = 'none';
    }
}