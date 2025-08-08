const setAuthCookie = (res, token, refreshToken) => {
  // Get the origin from the request to determine the domain
  const origin = res.req.headers.origin;
  const isProduction = process.env.NODE_ENV === "production";

  // Determine if we're dealing with cross-domain requests
  const isCrossDomain = origin && origin !== res.req.headers.host;

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Only secure in production
    sameSite: isCrossDomain ? "None" : "Lax", // Use None for cross-domain, Lax for same domain
    maxAge: 1000 * 60 * 15, // 15 minutes
  };

  // For cross-domain requests in production, we need to set the domain
  if (isProduction && isCrossDomain) {
    // Extract domain from Railway URL or use a wildcard
    const railwayDomain =
      process.env.RAILWAY_DOMAIN || process.env.RENDER_DOMAIN;
    if (railwayDomain) {
      cookieOptions.domain = railwayDomain;
    }
  }

  res.cookie("token", token, cookieOptions);

  // Refresh token cookie (longer expiry)
  const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isCrossDomain ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
  };

  if (isProduction && isCrossDomain) {
    const railwayDomain =
      process.env.RAILWAY_DOMAIN || process.env.RENDER_DOMAIN;
    if (railwayDomain) {
      refreshCookieOptions.domain = railwayDomain;
    }
  }

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export default setAuthCookie;
