'use strict';

function squareSum(numbers){
    let result = 0;

    for (let i = 0; i < numbers.length; i++) {
      result += (numbers[i] * numbers[i]);

  }
  console.log(result);
}
  squareSum([1, 2, 2]);


//! Makes Nav Bar fixed to top when scrolling beyond inital header section
window.onscroll = function() {fixedNavbar()};

let navBar = document.getElementsByClassName('nav__bar');
let fixed = navBar.offsetTop;

function fixedNavbar() {
    if (window.pageYOffset >= fixed) {
        navBar.classList.add('fixed-nav');
    } else {
        navBar.classList.remove('fixed-nav');
    }
};

//! Updates Copyright year within Footer section
let copyrightYear = new Date().getFullYear();
document.querySelector('.copyright').innerHTML = ' | ' + copyrightYear;

//! Grabs the "Add to Cart" button
let carts = document.querySelectorAll('.btn-form-order');

//! Stores catalog of pizza products for sale
let products = [
    {
        name: 'Spicy Pepperoni',
        tag: 'spicypepperoni',
        price: 20,
        inCart: 0
    },
    {
        name: 'Zesty Chorizo',
        tag: 'zestychorizo',
        price: 20,
        inCart: 0
    },
    {
        name: 'Savory Pineapple',
        tag: 'savorypineapple',
        price: 20,
        inCart: 0
    },
    {
        name: 'The Alpha Strike',
        tag: 'thealphastrike',
        price: 30,
        inCart: 0
    },
    {
        name: 'Breadsticks',
        tag: 'breadsticks',
        price: 5,
        inCart: 0
    },
    {
        name: 'Stuffed Breadsticks',
        tag: 'stuffedbreadsticks',
        price: 8,
        inCart: 0
    },
    {
        name: 'Garlic Bread',
        tag: 'garlicbread',
        price: 7,
        inCart: 0
    },
    {
        name: 'Poppers',
        tag: 'poppers',
        price: 10,
        inCart: 0
    }
];

for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
};

//! Function that checks the number of products currently in cart and updates the Cart button's number value on page load
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
};

//! Local Storage function for cart
function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');

    cartItems = JSON.parse(cartItems);

    if (action == 'decrease') {
        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1
    }
    setItems(product);
};

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    console.log('My cartItems are', cartItems);

    //! If statement starts adding to inCart value for each product item
    if (cartItems !== null) {

        //! This checks to see if a second (or more) product is clicked on and, if so, adds it to the 'product' object

        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;

        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
};

//! Function that calculates total cost of product(s) added to cart
function totalCost(product, action) {
    let cartCost = localStorage.getItem('totalCost');

    if (action == 'decrease') {
        cartCost = parseInt(cartCost);

        localStorage.setItem('totalCost', cartCost - product.price);
    } else if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price);
    } else if (!product.price){
        cartCost = parseInt(cartCost);
        cartCost = 0;
    } else {
        localStorage.setItem('totalCost', product.price);
    }
};

function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');

    cartItems = JSON.parse(cartItems);

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="close-circle"></ion-icon>
                <img src="./img/${item.tag}.jpg"/>
                <span class="cart-item-label">${item.name}</span>
            </div>
            <div class="product-price">$${item.price}.00</div>
            <div class="product-quantity">
                <ion-icon class="decrease" name="remove-circle"></ion-icon>
                <span>${item.inCart}</span>

                <ion-icon class="increase" name="add-circle"></ion-icon>
            </div>
            <div class="product-total">
                $${item.inCart * item.price}.00
            </div>
            `;
        });

        productContainer.innerHTML += `
            <div class='basketTotalContainer'>
                <h4 class='basket-total-title'>Basket Total</h4>
                <h4 class='basket-total'>$${cartCost}.00</h4>
            </div>
        `
        deleteButtons();
        manageQuantity();
    }
};

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem('totalCost');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;

    for(let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(cartItems[productName]);
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        })
    }
};

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let currentQuantity = 0;
    let currentProduct = '';

    for (let i = 0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '');
            console.log(currentProduct);
            console.log([currentProduct].inCart)

            if (cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], 'decrease');
                totalCost(cartItems[currentProduct], 'decrease');
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        })
    };

    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            console.log(increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase());
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            console.log(currentProduct.inCart);
            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        })
    };
};

onLoadCartNumbers();
displayCart();