import Product from './models/Product.js';
import { connectDatabase } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
    price: 599.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    featured: true
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch for maximum comfort. Perfect for casual outings.",
    price: 1899.00,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 30,
    featured: true
  },
  {
    name: "Women's Summer Dress",
    description: "Light and flowy summer dress with floral pattern. Perfect for warm weather occasions.",
    price: 2299.00,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    stock: 25,
    featured: true
  },
  {
    name: "Hooded Sweatshirt",
    description: "Warm and comfortable hoodie with front pocket. Great for casual wear and outdoor activities.",
    price: 1599.00,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    category: "Unisex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 40,
    featured: false
  },
  {
    name: "Kids Printed T-Shirt",
    description: "Colorful and fun t-shirt with cartoon prints. Made from child-friendly soft cotton.",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1503454532315-3dd33c3a571a?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M"],
    stock: 60,
    featured: false
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with vintage wash. Timeless piece for any wardrobe.",
    price: 2799.00,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    featured: true
  },
  {
    name: "Women's Yoga Pants",
    description: "High-waisted yoga pants with excellent stretch and comfort. Perfect for workouts or casual wear.",
    price: 1299.00,
    image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 35,
    featured: false
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt with embroidered logo. Smart casual look for various occasions.",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    featured: false
  },
  {
    name: "Summer Skirt",
    description: "Lightweight A-line skirt perfect for summer. Available in multiple colors.",
    price: 1199.00,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    stock: 28,
    featured: false
  },
  {
    name: "Kids Hoodie",
    description: "Warm and cozy hoodie for kids with fun prints. Perfect for chilly days.",
    price: 799.00,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 55,
    featured: false
  },
  {
    name: "Formal Shirt",
    description: "Crisp formal shirt with classic fit. Ideal for office wear and formal occasions.",
    price: 1499.00,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 32,
    featured: false
  },
  {
    name: "Winter Coat",
    description: "Warm winter coat with waterproof exterior. Stay warm and dry in cold weather.",
    price: 4599.00,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    featured: true
  },
  {
    name: "Casual Shorts",
    description: "Comfortable cotton shorts for casual summer wear. Available in multiple colors.",
    price: 699.00,
    image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    featured: false
  },
  {
    name: "Evening Gown",
    description: "Elegant evening gown for special occasions. Features delicate embroidery and flowing silhouette.",
    price: 5899.00,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    featured: true
  },
  {
    name: "Sports T-Shirt",
    description: "Moisture-wicking sports t-shirt perfect for workouts and athletic activities.",
    price: 799.00,
    image: "https://images.unsplash.com/photo-1578761952736-5c5f54e1cf15?w=500",
    category: "Unisex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 65,
    featured: false
  },
  {
    name: "Kids Jeans",
    description: "Durable and comfortable jeans for active kids. Reinforced knees for extra durability.",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1503454532315-3dd33c3a571a?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 48,
    featured: false
  },
  {
    name: "Leather Jacket",
    description: "Premium genuine leather jacket with classic biker style. Timeless fashion statement.",
    price: 7899.00,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    featured: true
  },
  {
    name: "Knit Sweater",
    description: "Soft and warm knit sweater perfect for fall and winter. Available in seasonal colors.",
    price: 1899.00,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 22,
    featured: false
  },
  {
    name: "Cargo Pants",
    description: "Functional cargo pants with multiple pockets. Perfect for outdoor activities and casual wear.",
    price: 1699.00,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 35,
    featured: false
  },
  {
    name: "Baby Romper",
    description: "Adorable and comfortable romper for babies. Easy to wear and made from soft organic cotton.",
    price: 499.00,
    image: "https://images.unsplash.com/photo-1589878615941-b6248ed8c6d9?w=500",
    category: "Kids",
    sizes: ["XS", "S"],
    stock: 70,
    featured: false
  },
  {
    name: "Business Suit",
    description: "Elegant business suit for professional settings. Premium fabric with perfect fit.",
    price: 6999.00,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    featured: true
  },
  {
    name: "Maxi Dress",
    description: "Beautiful maxi dress with elegant patterns. Perfect for parties and special events.",
    price: 3299.00,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    stock: 18,
    featured: false
  },
  {
    name: "Rain Jacket",
    description: "Waterproof rain jacket with hood. Stay dry in any weather condition.",
    price: 2199.00,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
    category: "Unisex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 25,
    featured: false
  },
  {
    name: "Graphic Tee",
    description: "Trendy graphic t-shirt with unique designs. Express your style with these cool tees.",
    price: 699.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    stock: 75,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MySQL database...');
    await connectDatabase();
    
    console.log('🗑️ Clearing existing products...');
    await Product.destroy({ where: {}, truncate: true });
    
    console.log('📦 Inserting products...');
    await Product.bulkCreate(products);
    
    console.log('✅ Database seeded successfully!');
    
    const productCount = await Product.count();
    const featuredCount = await Product.count({ where: { featured: true } });
    
    console.log('\n📊 === Seeding Summary ===');
    console.log(`Total products: ${productCount}`);
    console.log(`Featured products: ${featuredCount}`);
    console.log('==========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();