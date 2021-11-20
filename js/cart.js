function addItem(id, img, name, price){
      shoppingCart.addItemToCart(id, img, name, price, 0, 1);
      displayCart();
}
            // ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  
  // Constructor
  function Item(id, img, name, price, size, count) {
    this.id = id;
    this.img = img;
    this.name = name;
    this.price = price;
    this.size = size;
    this.count = count;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(id, img, name, price, size, count) {
    for(var item in cart) {
      if(cart[item].id === id) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(id, img, name, price, size, count);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(id, count) {
    for(var i in cart) {
      if (cart[i].id === id) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(id) {
      for(var item in cart) {
        if(cart[item].id === id) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }
  // add size of item to cart
  obj.addSizeOfItemToCart = function(id, size) {
      for(var item in cart) {
        if(cart[item].id === id) {
          cart[item].size = size;
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(id) {
    for(var item in cart) {
      if(cart[item].id === id) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 


// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {

  var cartArray = shoppingCart.listCart();
  var output = "";
    
  for(var i in cartArray) { 
      
     output += `<div class="col-lg-2 col-md-2 col-sm-2 col">
                    <a href="product.php?pid=${cartArray[i].id}"><img width='50' src='${cartArray[i].img}'></a>
                </div>
                <div class="col-lg-3 col-md-4 col-sm-4 col">
                    <span>${cartArray[i].name}</span>
                    <span style="float:right">$${cartArray[i].price}</span>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-6 mt-2 mb-2">
                    <table>
                        <tr>
                            <td>
                                <div class='input-group'>
                                    <button class='minus-item input-group-addon btn btn-primary' data-id="${cartArray[i].id}">-</button>
                                    <input type='number' class='item-count form-control' data-id='${cartArray[i].id}' value='${cartArray[i].count}'>
                                    <button class='plus-item btn btn-primary input-group-addon' data-id="${cartArray[i].id}">+</button>
                                </div>
                            </td>
                            <td>
                                <button class='delete-item btn btn-danger' data-id="${cartArray[i].id}">X</button
                            </td>
                            <td>$${cartArray[i].total}</td>
                        </tr>
                    </table>
                </div>`;
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var id = $(this).data('id')
  shoppingCart.removeItemFromCartAll(id);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var id = $(this).data('id')
  shoppingCart.removeItemFromCart(id);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var id = $(this).data('id')
  shoppingCart.addItemToCart(id);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var id = $(this).data('id');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(id, count);
  displayCart();
});

displayCart();
