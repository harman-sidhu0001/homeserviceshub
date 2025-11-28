const setAuthCookie = (res, token, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? "none" : "lax", // None for cross-site (prod), Lax for local
    maxAge: 1000 * 60 * 15, // 15 minutes
    // domain: undefined, // Let browser handle domain (host-only)
  };

  console.log("Setting cookies with options:", {
    isProduction,
    cookieOptions,
  });

  res.cookie("token", token, cookieOptions);

  // Refresh token cookie (longer expiry)
  const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
  };

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  console.log("Cookies set successfully");
};

export default setAuthCookie;
