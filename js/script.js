var products = []; // Storage products array


let requests = [];

var requestIdCounting = 100; // Request ID Generate.
var idCount = 0; // Product ID Generate.

function readLocalStorage() {
    if (!window.localStorage) {
        return;
    }
    var productsFromLocalStorage = window.localStorage.getItem('products');
    if (productsFromLocalStorage) {
        products = JSON.parse(productsFromLocalStorage);
    }
    var requestsFromLocalStorage = window.localStorage.getItem('requests');
    if (requestsFromLocalStorage) {
        requests = JSON.parse(requestsFromLocalStorage);
    }
    var counterRequestFromLocalStorage = window.localStorage.getItem('contador-pedido');
    if (counterRequestFromLocalStorage) {
        requestIdCounting = JSON.parse(counterRequestFromLocalStorage);
    }
    var counterProductFromLocalStorage = window.localStorage.getItem('contador-produto');
    if (counterProductFromLocalStorage) {
        idCount = JSON.parse(counterProductFromLocalStorage);
    }

};
readLocalStorage();


function writeToLocalStorage() {
    window.localStorage.setItem('products', JSON.stringify(products));
    window.localStorage.setItem('requests', JSON.stringify(requests));
    window.localStorage.setItem('contador-pedido', JSON.stringify(requestIdCounting));
    window.localStorage.setItem('contador-produto', JSON.stringify(idCount));
};

/* ELEMENTS ---------- Elements to create new product object on array */

let productImageInput = document.querySelector('#input-product-image'); // Input to product URL image 
let productNameInput = document.querySelector('#input-product-name'); // Input to product name.
let productDescriptionInput = document.querySelector('#input-product-description'); // Input to product description.
let productPriceInput = document.querySelector('#input-product-price'); // Input to product price.

/* FUNCTION ---------- Function to create new object with input information */

function addNewProduct() {
    var newProduct = {};
    newProduct.productId = idCount;
    newProduct.productImageUrl = productImageInput.value;
    newProduct.productName = productNameInput.value;
    newProduct.productDescription = productDescriptionInput.value;
    newProduct.productPrice = productPriceInput.value;
    newProduct.productRequestCounting = 1;
    products.push(newProduct);
    idCount = idCount + 1;
    writeToLocalStorage();
    render();
    console.log(products)
}

/* DIV TO RENDER ---------- Cards products space - Products Available cards */

var mainCards = document.querySelector('.cards');
var productsAvailableForRequest = document.querySelector('#request-products-available');

/* FUNCTION ---------- Create card with DOM elementes to products objects of array 'products'*/

function stringify(productPrice) {
    let productPriceEdited = String(productPrice);
    productPriceEdited = 'R$' + productPriceEdited;
    productPriceEdited = productPriceEdited.replace('.', ',');
    return productPriceEdited;
}

function invertStringify(productPrice) {
    let productPriceEdited = productPrice;
    productPriceEdited = productPriceEdited.replace(',', '.');
    productPriceEdited = productPriceEdited.replace('R$', '');
    productPriceEdited = parseFloat(productPriceEdited);
    return productPriceEdited;
}

function createElementProducts(id, productImageUrl, productName, productDescription, productPrice, divTarget) {
    var divProductCard = document.createElement('div');
    divProductCard.setAttribute('id', id);
    divProductCard.addEventListener('click', handleCardClick);
    divProductCard.classList.add('product-card');

    var imgProduct = document.createElement('img');
    imgProduct.setAttribute('src', productImageUrl);
    imgProduct.classList.add('product-image');

    var divProductInfo = document.createElement('div');
    divProductInfo.classList.add('product-info');

    var divSecundary = document.createElement('div');

    var productNameParagraph = document.createElement('p');
    productNameParagraph.classList.add('product-name');
    var add = document.createTextNode(productName);
    productNameParagraph.appendChild(add);

    var productDescriptionParagraph = document.createElement('p');
    productDescriptionParagraph.classList.add('product-description');
    var add = document.createTextNode(productDescription);
    productDescriptionParagraph.appendChild(add);

    var productPriceParagraph = document.createElement('p');
    productPriceParagraph.classList.add('product-price');
    var add = document.createTextNode(stringify(productPrice));
    productPriceParagraph.appendChild(add);

    divSecundary.appendChild(productNameParagraph);
    divSecundary.appendChild(productDescriptionParagraph);

    divProductInfo.appendChild(divSecundary);
    divProductInfo.appendChild(productPriceParagraph);

    divProductCard.appendChild(imgProduct);
    divProductCard.appendChild(divProductInfo);
    divTarget.appendChild(divProductCard);

}

/* RENDER ---------- Initial render in Products page */

function render() {
    readLocalStorage();
    if (mainCards) {
        mainCards.innerHTML = '';
        for (var i = 0; i < products.length; i++) {
            createElementProducts(
                products[i].productId,
                products[i].productImageUrl,
                products[i].productName,
                products[i].productDescription,
                products[i].productPrice,
                mainCards
            );
        }
    }

    if (productsAvailableForRequest) {
        productsAvailableForRequest.innerHTML = '';
        for (var i = 0; i < products.length; i++) {
            createElementProducts(
                products[i].productId,
                products[i].productImageUrl,
                products[i].productName,
                products[i].productDescription,
                products[i].productPrice,
                productsAvailableForRequest
            );
        }
    }
}

render();

/* MODAL ---------- Modal global with classes */

let modalContainer = document.querySelector('.backdrop-modal'); // Background full-view
let modalCloseButton = document.querySelector('.close-modal').addEventListener('click', closeModal); // Modal close button
let modalOpenButton = document.querySelector('.open-modal').addEventListener('click', openModal); // Modal open button

function openModal() {
    modalContainer.classList.remove('display-none-modal');
    modalContainer.classList.add('display-modal');

    if (productsAvailableForRequest) {
        refreshListOrder();
    }
}

function closeModal() {
    modalContainer.classList.remove('display-modal');
    modalContainer.classList.add('display-none-modal');

    if (productImageInput && productNameInput && productDescriptionInput && productPriceInput) {
        productImageInput.value = '';
        productNameInput.value = '';
        productDescriptionInput.value = '';
        productPriceInput.value = '';
    }

    if (productsAvailableForRequest) {
        productsAvailableForRequest.innerHTML = '';
        clientNameInput.value = '';
    }
    resetCounting();
    selectedProducts = [];
}

let orderDiv = document.querySelector('#order-details');

function handleCardClick(event) {
    var value = Number(event.currentTarget.id);

    if (orderDiv) {

        for (var i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i] === products[value]) {
                selectedProducts[i].productRequestCounting++;
                refreshListOrder();
                return;
            }
        }
        products[value].productRequestCounting++;
        selectedProducts.push(products[value]);
        refreshListOrder();
    }
    console.log(value);
}

let valueDiv = document.querySelector('#final-value');

function refreshListOrder() {
    orderDiv.innerHTML = '';
    for (var i = 0; i < selectedProducts.length; i++) {
        addProductToOrder(selectedProducts[i].productId, selectedProducts[i].productRequestCounting);
    }
    valueDiv.value = stringify(somaSelectedProducts());
}

let selectedProducts = [];

function somaSelectedProducts() {
    let soma = 0;
    for (var i = 0; i < selectedProducts.length; i++) {
        soma = soma + (selectedProducts[i].productPrice * selectedProducts[i].productRequestCounting);
    }
    return soma;
}

function addProductToOrder(productId, counting) {
    let newDiv0 = document.createElement('div');
    newDiv0.classList.add('selected-item-div');

    let newDiv1 = document.createElement('p');
    newDiv1.classList.add('selected-item-name');

    let newDiv2 = document.createElement('p');
    newDiv2.classList.add('selected-item-price');
    newDiv2.setAttribute('id', ('price-item' + (products[productId].productId)));

    let newDiv3 = document.createElement('p');
    newDiv3.classList.add('remove-item');
    newDiv3.setAttribute('id', products[productId].productId + 1000);
    newDiv3.addEventListener('click', handleRemoveItemClick);

    let selectedProductName = document.createTextNode(products[productId].productName + ' ' + counting + 'x');
    newDiv1.appendChild(selectedProductName);

    let selectedProductPrice = document.createTextNode(products[productId].productPrice);
    newDiv2.appendChild(selectedProductPrice);

    let removeItemButton = document.createTextNode('X');
    newDiv3.appendChild(removeItemButton);

    newDiv0.appendChild(newDiv1);
    newDiv2.appendChild(newDiv3);
    newDiv0.appendChild(newDiv2);
    orderDiv.appendChild(newDiv0);
}

function handleRemoveItemClick(event) {
    var itemValue = event.currentTarget.id;
    idItemRemove = itemValue - 1000;

    for (var count = 0; count < selectedProducts.length; count++) {
        if (idItemRemove === (selectedProducts[count].productId)) {
            if (selectedProducts[count].productRequestCounting >= 1) {
                selectedProducts[count].productRequestCounting--;
            }

            if ((selectedProducts[count].productRequestCounting == 0)) {
                selectedProducts.splice(count, 1);
            }
            refreshListOrder();
            return;
        }
    }
    console.log(idItemRemove);
}

function resetCounting() {
    for (var count = 0; count < selectedProducts.length; count++) {
        selectedProducts[count].productRequestCounting = 0;
    }

    for (var count = 0; count < products.length; count++) {
        products[count].productRequestCounting = 0;
    }

    writeToLocalStorage();
    refreshListOrder();
}

let requestListDiv = document.querySelector('.list-requests');

function getDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = date.getFullYear();

    const today = day + '/' + month + '/' + year;

    return today;
}

let clientNameInput = document.querySelector('#client-name');

function registerRequest() {
    let newRequest = {};
    newRequest.requestId = requestIdCounting;
    newRequest.requestDate = getDate();
    newRequest.requestClientName = clientNameInput.value;
    newRequest.requestValue = stringify(somaSelectedProducts());
    let newObject = {};
    let array = [];
    for (var i = 0; i < selectedProducts.length; i++) {
        array.push(selectedProducts[i].productName);
    }
    newObject.productsReq = array;
    array = [];
    for (var i = 0; i < selectedProducts.length; i++) {
        array.push(selectedProducts[i].productRequestCounting);
    }
    newObject.productsCounter = array;
    newRequest.productData = newObject;
    requests.push(newRequest);
    refreshRequests();
    requestIdCounting = requestIdCounting + 1;
    resetCounting();
    writeToLocalStorage();

}

var arrayNames = [];

function namesProducts(requestNumber) {
    arrayNames = [];
    for (var e = 0; e < requests[requestNumber].productData.productsReq.length; e++) {
        let newSpanRequestProductName = document.createElement('span');
        newSpanRequestProductName.classList.add('request-product-name');
        let namesProductsRequests = document.createTextNode(requests[requestNumber].productData.productsReq[e]);
        newSpanRequestProductName.appendChild(namesProductsRequests);
        arrayNames.push(newSpanRequestProductName);
    }

    return arrayNames;
}

var arrayProductsCounter = [];

function counterProducts(requestNumber) {
    arrayProductsCounter = [];
    for (var e = 0; e < requests[requestNumber].productData.productsCounter.length; e++) {
        let newSpanRequestCounting = document.createElement('span');
        newSpanRequestCounting.classList.add('request-products-count');
        let countProductsRequest = document.createTextNode(requests[requestNumber].productData.productsCounter[e] + 'x');
        newSpanRequestCounting.appendChild(countProductsRequest);
        arrayProductsCounter.push(newSpanRequestCounting);
    }

    return arrayProductsCounter;
}


function renderRequests(requestId, requestDate, clientName, productIndex, requestValue) {

    let newRequest = document.createElement('div');
    newRequest.classList.add('request');

    let newRequestId = document.createElement('p');
    newRequestId.classList.add('request-id');
    numberRequestId = document.createTextNode(requestId);
    newRequestId.appendChild(numberRequestId);

    let newRequestDate = document.createElement('p');
    newRequestDate.classList.add('request-date');
    numberRequestDate = document.createTextNode(requestDate);
    newRequestDate.appendChild(numberRequestDate);

    let newRequestClient = document.createElement('p');
    newRequestClient.classList.add('request-client-name');
    nameClient = document.createTextNode(clientName);
    newRequestClient.appendChild(nameClient);

    let newRequestProductsDiv = document.createElement('div');
    newRequestProductsDiv.classList.add('request-products');
    let listNamesProdus = namesProducts(productIndex);
    let listCountersProdus = counterProducts(productIndex);

    for (var i = 0; i < listNamesProdus.length; i++) {
        let newSpanProdu = document.createElement('span');
        newSpanProdu.classList.add('produ');
        newSpanProdu.appendChild(listNamesProdus[i]);
        newSpanProdu.appendChild(listCountersProdus[i]);
        newRequestProductsDiv.appendChild(newSpanProdu);
    };


    let newRequestValue = document.createElement('p');
    newRequestValue.classList.add('request-value');
    newValue = document.createTextNode(requestValue);
    newRequestValue.appendChild(newValue);

    newRequest.appendChild(newRequestId);
    newRequest.appendChild(newRequestDate);
    newRequest.appendChild(newRequestClient);
    newRequest.appendChild(newRequestProductsDiv);
    newRequest.appendChild(newRequestValue);

    requestListDiv.appendChild(newRequest);

}

function refreshRequests() {
    if (requestListDiv) {

        requestListDiv.innerHTML = '';
        for (var i = requests.length - 1; i >= 0; i--) {
            renderRequests(
                requests[i].requestId,
                requests[i].requestDate,
                requests[i].requestClientName,
                i,
                requests[i].requestValue
            )
        }

    }

}

refreshRequests();