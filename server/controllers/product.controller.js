import { redis } from "../lib/redis.js";
import fs from "fs";
import Product from "../models/product.model.js";
import { basename } from "path";
const getAllProducts = async (req, res) => {
  try {
    let products = await redis.get("products");
    if (products) {
      return res.json({ products });
    }
    products = await Product.find();
    return res.json({ products });
  } catch (error) {
    return res.json({
      msg: "un error occured in getAllprodcuts",
      error: error.message,
    });
  }
};

const getAllFeaturedProducts = async (req, res) => {
  try {
    let products = await redis.get("featured_products");
    if (products) {
      console.log("from redis");
      return res.json(JSON.parse(products));
    }
    products = await Product.find(
      { isFeatured: true },
      "name price description image category isFeatured"
    ).lean();
    products.forEach((ele) => {
      ele.image = `${process.env.APP_URL}/${ele.image}`;
    });
    if (!products.length) {
      return res.json({ msg: "No featured products" });
    }
    await redis.set("featured_products", JSON.stringify(products));
    return res.json(products);
  } catch (error) {
    console.log(`error in getAllfeaturedProdcuts function: ${error.message}`);
    res.status(500).json({ msg: "internal error in get featured products" });
  }
};
const createProduct = async (req, res) => {
  try {
    const image = req.file;
    const product = await Product.create({
      ...req.body,
      image: `api/products/images/${basename(image.path)}`,
      image_path: basename(image.path),
    });
    product.image = `${process.env.APP_URL}/${product.image}`;
    await refreshRedisCache("products", await Product.find({}));
    res.status(201).json({ product });
  } catch (error) {
    return res.status(500).json({ msg: "error occured", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(200).json({ msg: "Product not exists" });
    }
    fs.unlink(`${process.env.UPLOADS_URL}/${product.image_path}`, (error) => {
      if (error) {
        console.log("Error");
        return res.status(500).json({ msg: "Error in deleting product" });
      }
    });

    await Product.findByIdAndDelete(product.id);
    await refreshRedisCache("products", await Product.find({}));
    res.json({ msg: "product deleted successfully" });
  } catch (error) {
    console.log("Error deleteProduct function error", error.message);
    res.status(500).json({ msg: "Error in deleting the product" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find(
      { category },
      "name price description image category isFeatured"
    );
    products.forEach((ele) => {
      ele.image = `${process.env.APP_URL}/${ele.image}`;
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ msg: `no products in ${category} category` });
    }
    res.json(products);
  } catch (error) {
    console.log("error in getProductsByCategory", error.message);
    res.status(500).json({ msg: "internal error in get products by category" });
  }
};

const toggleFeaturedProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not exists" });
    }
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    const products = await Product.find({ isFeatured: true });
    await refreshRedisCache("featured_products", products);
    return res.json({ updatedProduct });
  } catch (error) {
    console.log(`Error in toggleFeaturedProduct error:${error.message}`);
    res.status(500).json({ msg: "internal error in toggle feature" });
  }
};

const refreshRedisCache = async (key, value) => {
  try {
    await redis.set(key, JSON.stringify(value));
  } catch (error) {
    console.log(
      "Error occured while update featured products cache",
      error.message
    );
  }
};

const getImage = (req, res) => {
  const image_url = `${process.env.UPLOADS_URL}/${req.params.image}`;
  res.sendFile(image_url, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ msg: "internal error" });
    }
  });
};

const getRandomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    if (!products.length) {
      return res.status(404).json({ msg: "No Products Exists as Random" });
    }
    return res.json({ products });
  } catch (error) {
    console.log("Error", error.message);
    return res
      .status(500)
      .json({ msg: "internal server error in getting random products" });
  }
};

export {
  getAllProducts,
  createProduct,
  deleteProduct,
  getAllFeaturedProducts,
  getProductsByCategory,
  getImage,
  toggleFeaturedProduct,
  getRandomProducts,
};
