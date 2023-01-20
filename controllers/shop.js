const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) =>
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isAuthenticated,
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
        isAuthenticated: req.session.isAuthenticated,
      })
    )
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) =>
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isAuthenticated,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const user = req.user;
  user
    .populate('cart.items.productId', ['_id', 'title', 'quantity'])
    .then((user) => user.cart.items)
    .then((productsPopulates) =>
      productsPopulates.map((product) => ({
        _id: product.productId._id,
        title: product.productId.title,
        quantity: product.quantity,
      }))
    )
    .then((products) =>
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isAuthenticated,
      })
    )
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const user = req.user;

  Product.findById(id)
    .then((product) => {
      user.addToCart(product);
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
  const userId = user._id;
  user
    .populate('cart.items.productId', ['_id', 'title', 'quantity'])
    .then((user) => user.cart.items)
    .then((productsPopulates) =>
      productsPopulates.map((product) => ({
        product: {
          _id: product.productId,
          title: product.productId.title,
        },
        quantity: product.quantity,
      }))
    )
    .then((products) => {
      const order = new Order({ products, userId });
      return order.save();
    })
    .then(() => user.cleanCart())
    .then(() => res.redirect('/orders'))
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((orders) =>
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isAuthenticated,
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
