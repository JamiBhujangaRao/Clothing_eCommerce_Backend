import { Op } from 'sequelize';
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      size,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = 'createdAt'
    } = req.query;

    // Build where conditions
    let where = {};

    // Search in name and description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      where.category = category;
    }

    // Filter by size - handle multiple sizes
    if (size) {
      const sizes = Array.isArray(size) ? size : [size];
      where.sizes = {
        [Op.overlap]: sizes // Check if any of the requested sizes exist in the product sizes
      };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Sort options
    let order = [];
    switch (sort) {
      case 'price-low':
        order = [['price', 'ASC']];
        break;
      case 'price-high':
        order = [['price', 'DESC']];
        break;
      case 'name':
        order = [['name', 'ASC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    // Execute query with pagination
    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalProducts: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { featured: true },
      limit: 8,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products'
    });
  }
};