import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  description: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);