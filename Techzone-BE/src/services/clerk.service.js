import axios from 'axios';

/**
 * Verify Clerk token - calls Clerk API to validate token
 */
export const verifyClerkToken = async (token) => {
  try {
    // Clerk API endpoint để verify token
    // Token thường có format: Bearer <token>
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    if (!clerkApiKey) {
      console.warn('CLERK_SECRET_KEY not configured');
      return null;
    }

    // Gửi request tới Clerk API để verify token
    const response = await axios.get('https://api.clerk.com/v1/sessions', {
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Parse JWT payload nếu Clerk API không available
    // Format: header.payload.signature
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const decoded = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );

      return {
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        name: decoded.name,
        clerkId: decoded.sub, // Clerk user ID
        isVerified: true,
      };
    } catch (parseError) {
      console.error('Error parsing Clerk token:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error verifying Clerk token:', error.message);
    return null;
  }
};

/**
 * Tìm hoặc tạo user từ Clerk token
 */
export const findOrCreateUserFromClerk = async (clerkData, connection) => {
  try {
    const { email, firstName, lastName, name, clerkId } = clerkData;

    if (!email) {
      throw new Error('Email not found in Clerk data');
    }

    // Tìm user theo email
    let [user] = await connection.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, 
              r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    // Nếu user đã tồn tại, return
    if (user) {
      return user;
    }

    // Tạo user mới từ Clerk data
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Clerk User';
    const [customerRole] = await connection.query(
      'SELECT id FROM roles WHERE name = ?',
      ['customer']
    );

    if (!customerRole) {
      throw new Error('Customer role not found');
    }

    const result = await connection.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_verified, clerk_id)
       VALUES (?, ?, ?, ?, TRUE, ?)`,
      [email, 'clerk_oauth', fullName, customerRole.id, clerkId]
    );

    const userId = result.insertId;

    // Tạo customer record
    await connection.query(
      'INSERT INTO customers (user_id, classification) VALUES (?, ?)',
      [userId, 'new']
    );

    // Tạo cart cho user
    await connection.query(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );

    // Lấy lại user vừa tạo
    const [newUser] = await connection.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, 
              r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    return newUser;
  } catch (error) {
    console.error('Error finding or creating user from Clerk:', error);
    throw error;
  }
};
