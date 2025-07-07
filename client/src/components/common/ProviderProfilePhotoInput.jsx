import React from "react";

const ProviderProfilePhotoInput = ({ value, onChange }) => (
  <div className="flex flex-col gap-2">
    {value && (
      <img
        src={typeof value === "string" ? value : URL.createObjectURL(value)}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border"
      />
    )}
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="p-2 border rounded"
    />
  </div>
);

export default ProviderProfilePhotoInput;
