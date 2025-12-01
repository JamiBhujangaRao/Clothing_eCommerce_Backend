import { Cart, CartItem } from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image', 'stock']
          }]
        }]
      });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart'
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Selected size not available for this product'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if item already exists in cart with same size
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
        size
      }
    });

    if (existingItem) {
      // Update quantity if item exists with same size
      existingItem.quantity += parseInt(quantity);
      await existingItem.save();
    } else {
      // Add new item with size
      await CartItem.create({
        cartId: cart.id,
        productId,
        size,
        quantity: parseInt(quantity)
      });
    }

    // Return updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }]
      }]
    });

    res.json({
      success: true,
      message: 'Product added to cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'This product with the same size is already in your cart'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding product to cart',
      error: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(itemId, {
      include: [{
        model: Cart,
        as: 'Cart',
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await cartItem.destroy();
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    // Return updated cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }]
      }]
    });

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart'
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findByPk(itemId, {
      include: [{
        model: Cart,
        as: 'Cart',
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    // Return updated cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }]
      }]
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart'
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { ...cart.toJSON(), items: [] }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
};