import React from "react";
import { GoVerified } from "react-icons/go";
import { FaClock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import CustomButton from "../common/Button";

const VerificationStatus = ({
  verificationStatus,
  onRequestVerification,
  onReRequestVerification,
  className = "",
}) => {
  // Don't show anything if verified
  if (verificationStatus === "verified") {
    return null;
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          title: "Get Verified",
          message:
            "You are not a verified user. Please get verified to build trust with other people. You can request verification by clicking the button below. Trusted Users can get more bookings and earn more. Get Verified Now at just Rs.500",
          buttonText: "Get Verified",
          buttonAction: onRequestVerification,
          buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
          bgClass: "bg-yellow-100 border-yellow-500 text-yellow-800",
        };

      case "requested":
        return {
          icon: <FaClock className="text-blue-500" />,
          title: "Under Process",
          message:
            "Your verification request is pending. Be ready with your documents(Aadhar Card, Pan Card, Passportsize Photo). Our team will contact you shortly.",
          buttonText: "Under Process",
          buttonAction: null,
          buttonClass: "cursor-not-allowed opacity-60",
          bgClass: "bg-blue-100 border-blue-500 text-blue-800",
        };

      case "rejected":
        return {
          icon: <FaExclamationTriangle className="text-red-500" />,
          title: "Verification Rejected",
          message:
            "Your verification request was rejected. You can re-request verification.",
          buttonText: "Re-request Verification",
          buttonAction: onReRequestVerification,
          buttonClass: "bg-red-500 hover:bg-red-600",
          bgClass: "bg-red-100 border-red-500 text-red-800",
        };

      default:
        return {
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          title: "Get Verified",
          message:
            "You are not a verified user. Please get verified to build trust with other people.",
          buttonText: "Get Verified",
          buttonAction: onRequestVerification,
          buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
          bgClass: "bg-yellow-100 border-yellow-500 text-yellow-800",
        };
    }
  };

  const config = getStatusConfig(verificationStatus);

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded flex items-center justify-between ${config.bgClass} ${className}`}
    >
      <div className="flex items-center">
        <div className="mr-3 text-xl">{config.icon}</div>
        <div>
          <h4 className="font-semibold">{config.title}</h4>
          <p className="text-sm">{config.message}</p>
        </div>
      </div>
      <CustomButton
        text={config.buttonText}
        onClick={config.buttonAction}
        customClass={config.buttonClass}
        disabled={!config.buttonAction}
        width="auto"
      />
    </div>
  );
};

export default VerificationStatus;
