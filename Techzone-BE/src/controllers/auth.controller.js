import { query, transaction } from '../config/database.config.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { generateOTP, saveOTP, verifyOTP } from '../services/otp.service.js';
import { sendOTPEmail, sendWelcomeEmail } from '../services/email.service.js';
import { verifyClerkToken, findOrCreateUserFromClerk } from '../services/clerk.service.js';

export const requestRegisterOTP = async (req, res, next) => {
  try {
    const { email, full_name } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser) {
      return errorResponse(res, 'Email đã được đăng ký', 409);
    }
    
    // Generate và lưu OTP
    const otpCode = generateOTP();
    await saveOTP(email, otpCode, 'register');
    
    // Gửi OTP qua email
    await sendOTPEmail(email, full_name, otpCode, 'register');
    
    return successResponse(
      res,
      { email },
      'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
      200
    );
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone, code, clerk_token, via_oauth } = req.body;
    let user = null;
    let userId = null;

    // Kiểm tra email đã tồn tại
    const [existingUser] = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return errorResponse(res, 'Email đã được đăng ký', 409);
    }

    // Nếu là Clerk OAuth registration
    if (via_oauth && clerk_token) {
      try {
        const clerkData = verifyClerkToken(clerk_token);
        if (!clerkData) {
          return errorResponse(res, 'Clerk token không hợp lệ', 401);
        }

        user = await findOrCreateUserFromClerk(clerkData, query);
        userId = user.id;
      } catch (clerkError) {
        console.error('Clerk register error:', clerkError);
        return errorResponse(res, 'Lỗi tạo tài khoản qua Clerk', 500);
      }
    } else {
      // Traditional OTP-based registration
      // Verify OTP
      const isValidOTP = await verifyOTP(email, code, 'register');
      if (!isValidOTP) {
        return errorResponse(res, 'Mã OTP không hợp lệ hoặc đã hết hạn', 400);
      }

      if (!full_name || !password) {
        return errorResponse(res, 'Thông tin cần thiết không đủ', 400);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Lấy role customer
      const [customerRole] = await query(
        'SELECT id FROM roles WHERE name = ?',
        ['customer']
      );

      if (!customerRole) {
        return errorResponse(res, 'Không tìm thấy role customer', 500);
      }

      // Tạo user mới
      const result = await query(
        `INSERT INTO users (email, password_hash, full_name, phone, role_id, is_verified) 
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [email, hashedPassword, full_name, phone || null, customerRole.id]
      );

      userId = result.insertId;

      // Tạo customer record
      await query(
        'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
        [userId, 'new']
      );

      // Tạo giỏ hàng cho user
      await query(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      );

      // Gửi email chào mừng
      sendWelcomeEmail(email, full_name).catch(err => console.error(err));

      // Lấy thông tin user
      const [userData] = await query(
        `SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, 
                r.name as role, u.created_at
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?`,
        [userId]
      );

      user = userData;
    }

    // Generate tokens
    const token = generateToken({ userId, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId });

    return successResponse(
      res,
      {
        account: user,
        token,
        refreshToken
      },
      via_oauth ? 'Đăng ký tài khoản thành công qua Google' : 'Đăng ký tài khoản thành công',
      201
    );
  } catch (error) {
    next(error);
  }
};

// ĐĂNG NHẬP (hỗ trợ email/password + Clerk OAuth)
export const login = async (req, res, next) => {
  try {
    const { email, password, clerk_token } = req.body;
    let user = null;

    // Nếu có Clerk token, ưu tiên xử lý Clerk login
    if (clerk_token) {
      try {
        const clerkData = verifyClerkToken(clerk_token);
        if (!clerkData) {
          return errorResponse(res, 'Clerk token không hợp lệ', 401);
        }

        // Tìm hoặc tạo user từ Clerk
        user = await findOrCreateUserFromClerk(clerkData, query);
      } catch (clerkError) {
        console.error('Clerk login error:', clerkError);
        return errorResponse(res, 'Lỗi xác thực Clerk', 500);
      }
    } else {
      // Traditional email/password login
      if (!email || !password) {
        return errorResponse(res, 'Email và password là bắt buộc', 400);
      }

      const [userData] = await query(
        `SELECT u.id, u.email, u.password_hash, u.full_name, u.phone, 
                u.avatar_url, u.is_active, u.is_verified, u.store_id,
                r.name as role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.email = ?`,
        [email]
      );

      if (!userData) {
        return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
      }

      if (!userData.is_active) {
        return errorResponse(res, 'Tài khoản đã bị khóa', 403);
      }

      const isValidPassword = await comparePassword(password, userData.password_hash);
      if (!isValidPassword) {
        return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
      }

      user = userData;
    }

    if (!user) {
      return errorResponse(res, 'Không thể xác thực người dùng', 500);
    }

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Log login activity
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await query(
      'INSERT INTO user_login_logs (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
      [user.id, ip, userAgent]
    );

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    delete user.password_hash;

    return successResponse(res, { account: user, token, refreshToken }, 'Đăng nhập thành công');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const [user] = await query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url,
              r.name as role, u.is_verified, u.created_at, u.last_login
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    
    if (user.role === 'customer') {
      const [customerInfo] = await query(
        'SELECT classification, total_orders, total_spent FROM customers WHERE user_id = ?',
        [req.user.id]
      );
      user.customer_info = customerInfo || null;
    }
    
    return successResponse(res, user, 'Lấy thông tin thành công');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, avatar_url } = req.body;
    const updates = [];
    const values = [];
    
    if (full_name) { updates.push('full_name = ?'); values.push(full_name); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (avatar_url) { updates.push('avatar_url = ?'); values.push(avatar_url); }
    
    if (updates.length === 0) {
      return errorResponse(res, 'Không có thông tin cần cập nhật', 400);
    }
    
    values.push(req.user.id);
    await query(`UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    
    const [updatedUser] = await query(
      'SELECT id, email, full_name, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );
    
    return successResponse(res, updatedUser, 'Cập nhật thành công');
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [user] = await query('SELECT id, full_name FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return successResponse(res, { email }, 'Nếu email tồn tại, mã OTP đã được gửi');
    }
    
    const otpCode = generateOTP();
    await saveOTP(email, otpCode, 'reset_password');
    await sendOTPEmail(email, user.full_name, otpCode, 'reset_password');
    
    return successResponse(res, { email }, 'Mã OTP đã được gửi');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, new_password } = req.body;
    
    const isValidOTP = await verifyOTP(email, code, 'reset_password');
    if (!isValidOTP) {
      return errorResponse(res, 'Mã OTP không hợp lệ', 400);
    }
    
    const hashedPassword = await hashPassword(new_password);
    await query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
    
    return successResponse(res, null, 'Đặt lại mật khẩu thành công');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    
    const [user] = await query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isValid = await comparePassword(current_password, user.password_hash);
    
    if (!isValid) {
      return errorResponse(res, 'Mật khẩu hiện tại không đúng', 400);
    }
    
    const hashedPassword = await hashPassword(new_password);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    return successResponse(res, null, 'Đổi mật khẩu thành công');
  } catch (error) {
    next(error);
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return errorResponse(res, 'Refresh token không được để trống', 400);
  }
  
  // Verify refresh token với refresh secret
  let decoded;
  try {
    decoded = verifyRefreshToken(refresh_token);
  } catch (error) {
    return errorResponse(res, 'Refresh token không hợp lệ hoặc đã hết hạn', 401);
  }
  
  try {
    
    // Lấy thông tin user
    const [user] = await query(
      `SELECT u.id, u.email, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [decoded.userId]
    );
    
    if (!user) {
      return errorResponse(res, 'Người dùng không tồn tại hoặc đã bị khóa', 401);
    }
    
    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id });
    
    return successResponse(
      res,
      { token: newToken, refreshToken: newRefreshToken },
      'Làm mới token thành công'
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(res, 'Đã xảy ra lỗi khi làm mới token', 500);
  }
};
