import { query } from '../config/database.config.js';

// Generate random OTP (6 digits)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Lưu OTP vào database
export const saveOTP = async (email, code, type = 'register') => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
  
  await query(
    `INSERT INTO otp_codes (email, code, type, expires_at) 
     VALUES (?, ?, ?, ?)`,
    [email, code, type, expiresAt]
  );
};

// Verify OTP
export const verifyOTP = async (email, code, type = 'register') => {
  const [otpRecord] = await query(
    `SELECT * FROM otp_codes 
     WHERE email = ? AND code = ? AND type = ? 
     AND is_used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC 
     LIMIT 1`,
    [email, code, type]
  );
  
  if (!otpRecord) {
    return false;
  }
  
  // Đánh dấu OTP đã sử dụng
  await query(
    `UPDATE otp_codes SET is_used = TRUE WHERE id = ?`,
    [otpRecord.id]
  );
  
  return true;
};

// Xóa OTP cũ
export const cleanupOldOTPs = async () => {
  await query(
    `DELETE FROM otp_codes WHERE expires_at < NOW() OR is_used = TRUE`
  );
};
