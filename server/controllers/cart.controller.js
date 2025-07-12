import Product from "../models/product.model.js";

const getProducts = async (req, res) => {
  const user = req.user;
  if (!user.cartItems.length) {
    return res.status(404).json({ msg: "no products exist in the cart" });
  }
  const products = await Product.find({
    _id: { $in: req.user.cartItems },
  });

  const products2 = await Product.find({
    _id: { $in: req.user.cartItems },
  });

  console.log(products2[0].id);

  const cartItems = products.map((product) => {
    const quantity = user.cartItems.find(
      (cartItem) => cartItem.id === product.id
    ).quantity;
    return { ...product.toJSON(), quantity };
  });

  return res.json(cartItems);
};

const addToCart = async (req, res) => {
  const user = req.user;
  try {
    const { productId } = req.body;
    if (!(await Product.findById(productId))) {
      return res.status(404).json({ msg: "product id not exist in the store" });
    }
    const existItem = user.cartItems.find((item) => item._id == productId);
    if (existItem) {
      existItem.quantity++;
    } else {
      user.cartItems.push({ _id: productId });
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart", error.message);
    res.status(500).json({ msg: "internal error", error: error.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    const user = req.user;
    user.cartItems = [];
    await user.save();
    res.json({ msg: "cart is empty now" });
  } catch (error) {
    console.log("Error occured in emptyCart function", error.message);
    res.status(500).json({ msg: "error in empty the cart" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    if (!quantity || quantity <= 0) {
      return res
        .status(500)
        .json({ msg: "Quantity is required and must be more than zero" });
    }
    const user = req.user;
    const product = await user.cartItems.find((item) => item._id == productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not exists in the cart" });
    } else {
      product.quantity = quantity;
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log("Error in updateQuantity", error.message);
    return res.status(500).json({ msg: "Internal error in update quantity" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;
    const items = user.cartItems.filter((item) => item._id == productId);
    user.cartItems = items;
    await user.save();
  } catch (error) {
    console.log("Error in removeFromCart", error.message);
    return res.status(500).json({ msg: "Internal error in remove From Cart " });
  }
};

export { getProducts, addToCart, emptyCart, updateQuantity, removeFromCart };
