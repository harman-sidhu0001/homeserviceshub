import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomButton from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/authSlice";
import { axiosClient } from "../../utils/axiosClient";

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Navigation items based on role
  let navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    // Ace Register or Ace Profile logic below
  ];
  if (role === "provider") {
    navItems.push({
      label: "Ace Profile",
      path: user && user._id ? `/provider/${user._id}` : "/provider-profile",
    });
  } else if (role === "both") {
    navItems.push({
      label: "Ace Profile",
      path: user && user._id ? `/provider/${user._id}` : "/provider-profile",
    });
  } else {
    // user, admin, or not logged in
    navItems.push({ label: "Ace Register", path: "/provider-register" });
  }
  navItems.push({ label: "Contact", path: "/contact" });

  // User menu items based on role
  let userMenuItems = [];
  // Define handleLogout before using it in userMenuItems
  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout"); // Ensure this endpoint clears cookies and Redis
      dispatch(logoutAction());
      setIsUserMenuOpen(false);
      if (
        location.pathname.startsWith("/profile") ||
        location.pathname.startsWith("/provider") ||
        location.pathname.startsWith("/user")
      ) {
        navigate("/login");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  if (role === "user") {
    userMenuItems = [
      { label: "Profile", path: `/profile/${user?._id || ""}` },
      { label: "Logout", path: "#", action: handleLogout },
    ];
  } else if (role === "provider") {
    userMenuItems = [
      { label: "Provider Profile", path: `/provider/${user?._id || ""}` },
      { label: "Logout", path: "#", action: handleLogout },
    ];
  } else if (role === "both") {
    userMenuItems = [
      { label: "Provider Profile", path: `/profile/${user?._id || ""}` }, // redirect to user profile
      { label: "Logout", path: "#", action: handleLogout },
    ];
  } else if (role === "admin") {
    userMenuItems = [
      { label: "Login", path: "/login" },
      { label: "Register", path: "/register" },
    ];
  } else {
    userMenuItems = [
      { label: "Login", path: "/login" },
      { label: "Register", path: "/register" },
    ];
  }

  // Navigate to dynamic profile route
  const handleProfile = () => {
    if (role === "provider" && user && user._id) {
      navigate(`/provider/${user._id}`);
    } else if ((role === "user" || role === "both") && user && user._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <LazyLoadImage
            src="/assets/images/logo.svg"
            alt="HomeServicesHub Logo"
            className="h-16 w-auto"
            placeholderSrc="/assets/images/logo-placeholder.svg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-accent hover:text-primary hover:bg-primary/10"
                }`}
            >
              {item.label}
            </Link>
          ))}
          {/* User Menu */}
          <div className="relative">
            <CustomButton
              text={user?.name || "Account"}
              customClass="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-accent hover:text-primary hover:bg-primary/10"
              onClick={toggleUserMenu}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </CustomButton>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
                >
                  {userMenuItems.map((item, index) => (
                    <li key={index}>
                      <span
                        onClick={() => {
                          if (item.action) item.action();
                          else navigate(item.path);
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-accent hover:bg-primary/10 hover:text-primary cursor-pointer"
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <CustomButton
          text=""
          customClass="md:hidden p-2 rounded-md text-accent hover:bg-primary/10"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </CustomButton>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-accent/20"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className={`px-3 py-2 rounded-md text-base font-medium
                    ${
                      location.pathname === item.path
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-accent hover:text-primary hover:bg-primary/10"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              {userMenuItems.map((item) => (
                <span
                  onClick={() => {
                    if (item.action) item.action();
                    else navigate(item.path);
                    setIsUserMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-accent hover:bg-primary/10 hover:text-primary cursor-pointer"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default HomeNavbar;
