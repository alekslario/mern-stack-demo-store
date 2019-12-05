import mongoose from "mongoose";
import shortid from "shortid";

const { String, Number } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    large: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    small: {
      type: String,
      required: true
    }
  }
});

// prettier-ignore
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
