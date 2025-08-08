const setAuthCookie = (res, token, refreshToken) => {
  // Get the origin from the request to determine the domain
  const origin = res.req.headers.origin;
  const isProduction = false;

  // Determine if we're dealing with cross-domain requests
  const isCrossDomain = origin && origin !== res.req.headers.host;

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Only secure in production
    sameSite: "none", // Use None for cross-domain, Lax for same domain
    maxAge: 1000 * 60 * 15, // 15 minutes
  };

  // For Railway/Render, we don't set domain - let the browser handle it
  // Setting domain to .railway.app causes "invalid domain" error
  // The browser will automatically send cookies to the correct domain

  res.cookie("token", token, cookieOptions);

  // Refresh token cookie (longer expiry)
  const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
  };

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export default setAuthCookie;
