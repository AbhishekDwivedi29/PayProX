const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 60 * 60 * 1000 // 1 hour
  });
};

module.exports = setAuthCookie;
