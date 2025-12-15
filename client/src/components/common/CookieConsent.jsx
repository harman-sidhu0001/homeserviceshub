import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 text-white shadow-lg md:flex md:items-center md:justify-between"
        >
          <div className="mb-4 md:mb-0 md:mr-4 text-sm">
            <p>
              We use cookies to enhance your experience. By continuing to visit
              this site you agree to our use of cookies.{" "}
              <Link to="/privacy-policy" className="underline text-primary">
                Learn more
              </Link>
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors text-sm whitespace-nowrap"
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
