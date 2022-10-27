const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fecthAll()
    .then((products) =>
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) =>
      res.render('shop/product-detail', {
        product,
        pageTitle: 'Shop',
        path: '/products',
      })
    )
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fecthAll()
    .then((products) =>
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const user = req.user;

  user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const user = req.user;
  let quantity = 1;
  let cartCopy;

  Product.findByPk(id)
    .then((product) => {
      user
        .getCart()
        .then((cart) => {
          cartCopy = cart;
          return cart.getProducts(
            { where: { id } },
            { joinTableAttributes: ['quantity'] }
          );
        })
        .then((products) => {
          if (products.length > 0) {
            quantity = products[0].cartItem.quantity + 1;
          }
          cartCopy.addProduct(product, { through: { quantity } });
          res.redirect('/cart');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  const user = req.user;

  user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id } }))
    .then((products) => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  const user = req.user;
  let fetchedCart;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      cart.getProducts();
    })
    .then((products) => {
      user
        .createOrder()
        .then((order) =>
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
        )
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => fetchedCart.destroy())
    .then(() => res.redirect('/orders'))
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  const user = req.user;

  user
    .getOrders({ include: ['products'] })
    .then((orders) =>
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
