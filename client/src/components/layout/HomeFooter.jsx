// File: src/layouts/HomeFooter.jsx

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">HomeServicesHub</h3>
          <p className="text-sm text-gray-200 mb-4">
            Connecting you with trusted professionals across cities.
          </p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-gray-300 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Service Areas */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>Amritsar</li>
            {/* Future cities can be added here */}
          </ul>
        </div>

        {/* Providers */}
        <div>
          <h4 className="text-lg font-semibold mb-4">For Providers</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link
                to="/provider/login"
                className="hover:text-white transition"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/provider/signup"
                className="hover:text-white transition"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/provider/help" className="hover:text-white transition">
                Help & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} HomeServicesHub.in — All rights reserved.
      </div>
    </footer>
  );
};

export default HomeFooter;
