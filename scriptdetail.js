var pos = 0;
var totalSlides = $("#slider-wrap ul li").length;
var sliderWidth = $("#slider-wrap").width();

// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function () {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];

  // Constructor
  function Item(name, price, count,id,img) {
    // console.log(name, price, count,id);
    this.name = name;
    this.price = price;
    this.count = count;
    this.id = id;
    this.img = img;

  }

  // Save cart
  function saveCart() {
    window.localStorage.setItem("shoppingCart", JSON.stringify(cart));

    console.log(cart)
  }

  // Load cart
  function loadCart() {
    cart = JSON.parse(window.localStorage.getItem("shoppingCart"));
  }
  if (window.localStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};

  // Add to cart
  obj.addItemToCart = function (name, price, count,id,img) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count,id,img);
    console.log(item);
    cart.push(item);
    saveCart();
  };
  // Set count from item
  obj.setCountForItem = function (name, count,id) {
    for (var i in cart) {
      if (cart[i].id === id) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function (id) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function (id) {
    for (var item in cart) {
      if (cart[item].id === id) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = function () {
    var totalCount = 0;
    for (var item in cart) {
		console.log(cart[item].count)
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function () {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List cart
  obj.listCart = function () {
    var cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
	// console.log(cartCopy)
    return cartCopy;
  };


  return obj;
})();

// *****************************************
// Triggers / Events
// *****************************************
// Add item
//   $('.add-to-cart').click(function(event) {
//     event.preventDefault();
//     var name = $(this).data('name');
//     var price = Number($(this).data('price'));
//     shoppingCart.addItemToCart(name, price, 1);
//     displayCart();
//   });

// Clear items
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCart();
  for (var i in cartArray){
	// console.log(cartArray[i].id);
  }
  var output = "";
  for (var i in cartArray) {
    output +=
      "<tr>" +
      "<td>" +
      cartArray[i].name +
      "</td>" +
      "<td>(" +
      (cartArray[i].price).toLocaleString() +
      ")</td>" +
      "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-id=" +
      cartArray[i].id +
      ">-</button>" +
      "<input type='number' class='item-count form-control' data-id='" +
      cartArray[i].id +
      "' value='" +
      cartArray[i].count +
      "'>" +
      "<button class='plus-item btn btn-primary input-group-addon' data-id='" +
      cartArray[i].id +
      "'>+</button></div></td>" +
      "<td><button class='delete-item btn btn-danger' data-id=" +
      cartArray[i].id +
      ">X</button></td>" +
      " = " +
      "<td>" +
      parseInt(cartArray[i].total).toLocaleString()+ "đ"
      "</td>" +
      "</tr>";
  }
  $(".show-cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart().toLocaleString());
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete item button

$(".show-cart").on("click", ".delete-item", function (event) {
  var id = $(this).data("id");
//   console.log(id);
  shoppingCart.removeItemFromCartAll(id);
  displayCart();
});

// -1
$(".show-cart").on("click", ".minus-item", function (event) {
  var id = $(this).data("id");
  shoppingCart.removeItemFromCart(id);
  displayCart();
});
// +1
$(".show-cart").on("click", ".plus-item", function (event) {
  var id = $(this).data("id");
  shoppingCart.addItemToCart(1,2,3,id);
  displayCart();
});

// Item count input
$(".show-cart").on("change", ".item-count", function (event) {
  var id = $(this).data("id");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(id, count);
  displayCart();
});

displayCart();

$(".add-to-cart").click(function (event) {
  event.preventDefault();
  var name = $(this).data("name");
  var img = $(this).data("img");
  var price = Number($(this).data("price"));
  var id = Number($(this).data("id"));
  // console.log(name, price, 1,id,img)
  shoppingCart.addItemToCart(name, price, 1,id,img);
  displayCart();
});

document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://632fc662591935f3c8851f34.mockapi.io/api/apiphone";
  let buyBtn = document.querySelector(".add-to-cart");
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      const id = location.href.slice(34, 36);
      const dataDetail = data.find((item) => item.id == id);
      if (dataDetail) {
        buyBtn.setAttribute("data-name", dataDetail.name);
        buyBtn.setAttribute("data-price", dataDetail.price);
        buyBtn.setAttribute("data-id", dataDetail.id);
        buyBtn.setAttribute("data-img", dataDetail.img);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});





/***********
 SLIDE LEFT
************/
function slideLeft() {
  pos--;
  if (pos == -1) {
    pos = totalSlides - 1;
  }
  $("#slider-wrap ul#slider").css("left", -(sliderWidth * pos));

  //*> optional
  // countSlides();
  // pagination();
}

/************
 SLIDE RIGHT
*************/
function slideRight() {
  pos++;
  if (pos == totalSlides) {
    pos = 0;
  }
  $("#slider-wrap ul#slider").css("left", -(sliderWidth * pos));

  //*> optional
  countSlides();
  pagination();
}

/************************
 //*> OPTIONAL SETTINGS
************************/
function countSlides() {
  $("#counter").html(pos + 1 + " / " + totalSlides);
}

function pagination() {
  $("#pagination-wrap ul li").removeClass("active");
  $("#pagination-wrap ul li:eq(" + pos + ")").addClass("active");
}
$(document).ready(function () {
  /*****************
	 BUILD THE SLIDER
	*****************/
  //set width to be 'x' times the number of slides
  $("#slider-wrap ul#slider").width(sliderWidth * totalSlides);

  //next slide
  $("#next").click(function () {
    slideRight();
  });

  //previous slide
  $("#previous").click(function () {
    slideLeft();
  });

  /*************************
	 //*> OPTIONAL SETTINGS
	************************/
  //automatic slider
  var autoSlider = setInterval(slideRight, 3000);

  // //for each slide
  // $.each($('#slider-wrap ul li'), function() {
  //    //set its color
  //    var c = $(this).attr("data-color");
  //    $(this).css("background",c);

  //    //create a pagination
  //    var li = document.createElement('li');
  //    $('#pagination-wrap ul').append(li);
  // });

  //counter
  // countSlides();

  //pagination
  // pagination();

  //hide/show controls/btns when hover
  //pause automatic slide when hover
  $("#slider-wrap").hover(
    function () {
      $(this).addClass("active");
      clearInterval(autoSlider);
    },
    function () {
      $(this).removeClass("active");
      autoSlider = setInterval(slideRight, 4000);
    }
  );
});
