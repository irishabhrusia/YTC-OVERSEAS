const jwt = require('jsonwebtoken');

/**
 * Creates a JWT payload { id, role } signed with JWT_SECRET.
 * Expiry defaults to 1d or process.env.JWT_EXPIRES_IN.
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
};

/**
 * Helper to set the 'token' HTTP-only cookie on the response.
 */
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.cookie('token', token, cookieOptions);
};

module.exports = {
  generateToken,
  setTokenCookie,
};

