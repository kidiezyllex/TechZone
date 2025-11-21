import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc dùng SendGrid
  auth: {
    user: process.env.EMAIL_USER || 'techzone.noreply@gmail.com',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// Template email OTP
const otpEmailTemplate = (name, code, type) => {
  const typeText = type === 'register' ? 'đăng ký tài khoản' : 'đặt lại mật khẩu';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; color: #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Xác thực tài khoản Techzone</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${name}!</h2>
          <p>Bạn đã yêu cầu ${typeText} tại Techzone. Vui lòng sử dụng mã OTP dưới đây để hoàn tất:</p>
          
          <div class="otp-code">${code}</div>
          
          <div class="warning">
            <strong>⚠️ Lưu ý:</strong>
            <ul>
              <li>Mã OTP này có hiệu lực trong <strong>10 phút</strong></li>
              <li>Không chia sẻ mã này với bất kỳ ai</li>
              <li>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email</li>
            </ul>
          </div>
          
          <p>Trân trọng,<br><strong>Đội ngũ Techzone</strong></p>
        </div>
        <div class="footer">
          <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          <p>&copy; 2024 Techzone - Laptop & Linh kiện máy tính</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Gửi OTP qua email
export const sendOTPEmail = async (email, name, code, type = 'register') => {
  try {
    const mailOptions = {
      from: `"Techzone" <${process.env.EMAIL_USER || 'techzone@example.com'}>`,
      to: email,
      subject: type === 'register' 
        ? '🔐 Mã OTP đăng ký tài khoản Techzone' 
        : '🔐 Mã OTP đặt lại mật khẩu Techzone',
      html: otpEmailTemplate(name, code, type)
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

// Gửi email chào mừng
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"Techzone" <${process.env.EMAIL_USER || 'techzone@example.com'}>`,
      to: email,
      subject: '🎉 Chào mừng bạn đến với Techzone!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Chào mừng ${name}!</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Techzone - cửa hàng laptop và linh kiện máy tính uy tín.</p>
          <p>Bạn có thể bắt đầu khám phá hàng ngàn sản phẩm chất lượng và nhận được các ưu đãi độc quyền.</p>
          <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
          <p>Trân trọng,<br><strong>Đội ngũ Techzone</strong></p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Không throw error vì đây không phải critical
    return false;
  }
};
