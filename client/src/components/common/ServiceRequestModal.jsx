import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FormInput } from "./FormInput";
import { handleAsync } from "../../utils/handleAsync";
import { requestService } from "../../model/user";

export const ServiceRequestModal = ({
  isOpen,
  onClose,
  provider,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    preferredDate: "",
    location: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const requestData = {
        ...formData,
        providerId: provider._id,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      const { success, data, error } = await handleAsync(() =>
        requestService(requestData)
      );

      if (success) {
        onSuccess(data);
        onClose();
        setFormData({
          serviceName: "",
          description: "",
          preferredDate: "",
          location: "",
          budget: "",
        });
      } else {
        setError(
          error?.response?.data?.message ||
            error.message ||
            "Failed to submit request"
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Service">
      <div className="p-6">
        {provider && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={
                  provider.providerProfile?.profilePhoto ||
                  "/assets/icons/default-profile-picture.svg"
                }
                alt={provider.providerProfile?.companyName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {provider.providerProfile?.companyName}
                </h3>
                <p className="text-sm text-gray-600">
                  {provider.providerProfile?.location}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Service Name"
            name="serviceName"
            type="text"
            value={formData.serviceName}
            onChange={handleInputChange}
            placeholder="e.g., AC Repair, Plumbing, Painting"
            required
          />

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your service requirement in detail..."
            required
          />

          <FormInput
            label="Preferred Date"
            name="preferredDate"
            type="datetime-local"
            value={formData.preferredDate}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Service location address"
            required
          />

          <FormInput
            label="Budget (Optional)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleInputChange}
            placeholder="Expected budget in ₹"
            min="0"
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
