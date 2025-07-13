import React, { useRef, useState } from "react";
import CustomButton from "../common/Button";

const ProviderEditProfileModal = ({
  open,
  onClose,
  onSubmit,
  profilePhoto,
  onPhotoChange,
  requestStatus,
  onRequestChange,
  canRequest,
  requestCount,
}) => {
  const [changeRequest, setChangeRequest] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // <-- store file
  const fileInputRef = useRef();

  const handleRequest = () => {
    if (!changeRequest.trim()) {
      setError("Please describe the changes you want.");
      return;
    }
    setError("");
    onRequestChange(changeRequest);
    setChangeRequest("");
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(URL.createObjectURL(file));
      setSelectedFile(file); // <-- store file
      onPhotoChange(e); // keep this for preview in parent if needed
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile); // pass file, not preview url
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-xl font-bold mb-2">Edit Profile</div>
        <div className="mb-4 flex flex-col items-center">
          <img
            src={
              selectedPhoto ||
              profilePhoto ||
              "/assets/icons/default-profile-picture.svg"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2 object-top"
          />
          <CustomButton
            text="Update Profile Photo"
            onClick={handlePhotoButtonClick}
            type="button"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="mb-4 text-gray-700 text-sm">
          If you want to make any other changes, submit a request and our team
          will contact you at their earliest convenience.
        </div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          placeholder="Describe the changes you want..."
          value={changeRequest}
          onChange={(e) => setChangeRequest(e.target.value)}
          rows={3}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="mb-2 text-xs text-gray-500">
          {requestCount < 10
            ? `You can make ${
                10 - requestCount
              } more free requests. After that, each request is charged ₹100.`
            : "Each request is now charged ₹100."}
        </div>
        <div className="mb-2 text-xs text-gray-500">
          {requestStatus === "pending" &&
            "You have a pending request. Please wait for it to be processed."}
          {requestStatus === "completed" &&
            "Your last request was completed. You can submit a new request."}
          {requestStatus === "rejected" &&
            "Your last request was rejected. You can submit a new request."}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <CustomButton
            text="Submit Request"
            type="submit"
            disabled={!canRequest}
          />
        </div>
      </form>
    </div>
  );
};

export default ProviderEditProfileModal;
