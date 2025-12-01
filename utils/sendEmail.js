import nodemailer from 'nodemailer';
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};
export const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.size}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Thank You for Your Order!</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h2 style="color: #555;">Order Details</h2>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">${order.status}</span></p>
          </div>
          <h3 style="color: #555; margin-top: 20px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f2f2f2;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Size</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <div style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px;">
            Total Amount: ₹${order.totalPrice}
          </div>
          <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2d5016;">We're preparing your order and will notify you when it's on its way!</p>
          </div>
          <footer style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>Thank you for shopping with us!</p>
          </footer>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};
