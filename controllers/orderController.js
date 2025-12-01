import { Order, OrderItem } from '../models/Order.js';
import { Cart, CartItem } from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

export const createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart with items
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }],
      transaction
    });

    if (!cart || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const itemTotal = parseFloat(product.price) * cartItem.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: parseFloat(product.price)
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalPrice,
      shippingAddress,
      paymentMethod
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction });
    }

    // Clear user's cart
    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction
    });

    // Commit transaction
    await transaction.commit();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order, req.user);
      console.log('✅ Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Don't fail the order if email fails
    }

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image']
        }]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'description']
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};