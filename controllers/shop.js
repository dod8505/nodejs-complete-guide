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

  Product.findById(id)
    .then((product) => {
      user.addCart(product);
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  const user = req.user;

  user
    .deleteItemFromCart(id)
    .then(() => res.redirect('/cart'))
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  const user = req.user;

  user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  const user = req.user;

  user
    .getOrders()
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
