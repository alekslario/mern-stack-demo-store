import Product from "../../models/Product";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}

async function handlePostRequest(req, res) {
  const { name, price, description, mediaUrl } = req.body;
  try {
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).send("Product missing one or more fields");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl
    }).save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error in creating product");
  }
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  try {
    // 1) Delete product by id
    const product = await Product.findOneAndDelete({ _id });

    // 2) Remove product from all carts, referenced as 'product'
    await Cart.updateMany(
      { "products.product": _id },
      { $pull: { products: { product: _id } } }
    );
    const { large, medium, small } = product.mediaUrl;
    cloudinary.api.delete_resources(
      [large, medium, small].map(
        ele => "mern-stack-demo-store/" + ele.replace(/.+\/(.+?)\.webp$/i, "$1")
      ),
      (error, result) => {
        if (error) {
          console.log(error);
        }
      }
    );
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
}
