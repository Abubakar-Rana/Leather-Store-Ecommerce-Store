import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';
import Product from './models/Product';
import { categories } from '../data/categories';
import { products } from '../data/products';

dotenv.config({ path: '.env.local' });

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories inserted:', insertedCategories.length);

    // Create a map of category names to IDs
    const categoryMap: { [key: string]: string } = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString();
    });

    // Update products with category IDs and proper format
    const productsWithIds = products.map((product: any, index) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
      stockQuantity: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
      images: [product.image || '/next.svg'],
      category: categoryMap[product.category] || product.category,
      subcategory: product.subcategory,
      featured: index % 5 === 0, // Make every 5th product featured
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithIds);
    console.log('Products inserted:', insertedProducts.length);

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();