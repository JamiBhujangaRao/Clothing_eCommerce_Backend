import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Product from './Product.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    unique: true
  }
}, {
  tableName: 'carts'
});

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['XS', 'S', 'M', 'L', 'XL', 'XXL']],
        msg: 'Invalid size'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      }
    }
  }
}, {
  tableName: 'cart_items',
  indexes: [
    {
      unique: true,
      fields: ['cartId', 'productId', 'size'] // Include size in unique constraint
    }
  ]
});

// Define associations
Cart.belongsToMany(Product, { 
  through: CartItem, 
  foreignKey: 'cartId',
  otherKey: 'productId',
  as: 'products'
});

Product.belongsToMany(Cart, { 
  through: CartItem, 
  foreignKey: 'productId',
  otherKey: 'cartId'
});

Cart.hasMany(CartItem, { 
  foreignKey: 'cartId',
  as: 'items'
});

CartItem.belongsTo(Product, { 
  foreignKey: 'productId',
  as: 'product'
});

CartItem.belongsTo(Cart, { 
  foreignKey: 'cartId'
});

export { Cart, CartItem };