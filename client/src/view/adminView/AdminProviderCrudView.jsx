import React from "react";
import CustomButton from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import ProviderProfilePhotoInput from "../../components/common/ProviderProfilePhotoInput.jsx";

const AdminProviderCrudView = ({
  loading,
  error,
  providerSearch,
  setProviderSearch,
  filteredProviders,
  handleDeactivate,
  handleActivate,
  handleDelete,
  modal,
  setModal,
  confirmAction,
  handleEdit,
  editModal,
  setEditModal,
  editForm,
  setEditForm,
  handleEditChange,
  handleEditSubmit,
  allServices,
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">All Providers</h2>
    <input
      type="text"
      placeholder="Search by name or phone..."
      value={providerSearch}
      onChange={(e) => setProviderSearch(e.target.value)}
      className="mb-4 p-2 border rounded w-full"
    />
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      <ul>
        {filteredProviders.map((provider) => {
          const p = provider.providerProfile || {};
          const isActive = provider.isActive !== false;
          return (
            <li
              key={provider._id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {p.companyName || "No Name"} |{" "}
                {p.phone || provider.phone || "No Number"}
                {!isActive && (
                  <span className="ml-2 text-xs text-red-500">(Inactive)</span>
                )}
              </span>
              <div className="flex gap-2">
                <CustomButton
                  text="Edit Profile"
                  onClick={() => handleEdit(provider)}
                />
                <CustomButton
                  text={isActive ? "Deactivate" : "Activate"}
                  onClick={() =>
                    isActive
                      ? handleDeactivate(provider._id)
                      : handleActivate(provider._id)
                  }
                />
                <CustomButton
                  text="Delete"
                  onClick={() => handleDelete(provider._id)}
                />
              </div>
            </li>
          );
        })}
      </ul>
    )}
    <Modal
      open={modal.open}
      onClose={() => setModal({ open: false, providerId: null, action: null })}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {modal.action === "delete"
            ? "Are you sure you want to delete this provider profile?"
            : "Are you sure you want to deactivate this provider profile?"}
        </h3>
        <div className="flex gap-4 mt-4">
          <CustomButton
            text="Cancel"
            onClick={() =>
              setModal({ open: false, providerId: null, action: null })
            }
          />
          <CustomButton text="Confirm" onClick={confirmAction} />
        </div>
      </div>
    </Modal>
    {/* Edit Provider Profile Modal */}
    <Modal
      open={editModal.open}
      onClose={() => setEditModal({ open: false, provider: null })}
    >
      <div className="p-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Provider Profile</h3>
        {editForm && (
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-3"
            autoComplete="off"
          >
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={editForm.companyName || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Provider Email</label>
            <input
              type="text"
              name="providerEmail"
              value={editForm.providerEmail || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={editForm.phone || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={editForm.location || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Profile Photo</label>
            <ProviderProfilePhotoInput
              value={editForm.profilePhoto}
              onChange={handleEditChange}
            />
            <label>Intro</label>
            <input
              type="text"
              name="intro"
              value={editForm.intro || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Projects Done</label>
            <input
              type="number"
              name="projectsDone"
              value={editForm.projectsDone || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Projects Ongoing</label>
            <input
              type="number"
              name="projectsOngoing"
              value={editForm.projectsOngoing || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Year of Establishment</label>
            <input
              type="number"
              name="yearOfEstablishment"
              value={editForm.yearOfEstablishment || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Subscription Plan</label>
            <input
              type="text"
              name="subscriptionPlan"
              value={editForm.subscriptionPlan || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Payment Methods (comma separated)</label>
            <input
              type="text"
              name="paymentMethods"
              value={editForm.paymentMethods || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Services</label>
            <div className="flex flex-wrap gap-2">
              {allServices &&
                allServices.map((service) => (
                  <label key={service._id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="services"
                      value={service.name}
                      checked={
                        Array.isArray(editForm.services)
                          ? editForm.services.includes(service.name)
                          : false
                      }
                      onChange={(e) => {
                        let newServices = Array.isArray(editForm.services)
                          ? [...editForm.services]
                          : [];
                        if (e.target.checked) {
                          if (!newServices.includes(service.name))
                            newServices.push(service.name);
                        } else {
                          newServices = newServices.filter(
                            (s) => s !== service.name
                          );
                        }
                        handleEditChange({
                          target: { name: "services", value: newServices },
                        });
                      }}
                    />
                    {service.name}
                  </label>
                ))}
            </div>
            <label>Service Areas (comma separated)</label>
            <input
              type="text"
              name="serviceAreas"
              value={editForm.serviceAreas || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Total Workers</label>
            <input
              type="number"
              name="totalWorkers"
              value={editForm.totalWorkers || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Gallery (comma separated URLs)</label>
            <input
              type="text"
              name="gallery"
              value={editForm.gallery || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <label>Awards (comma separated)</label>
            <input
              type="text"
              name="awards"
              value={editForm.awards || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Change Password</label>
              <input
                type="password"
                name="newPassword"
                value={editForm.newPassword || ""}
                onChange={handleEditChange}
                placeholder="New Password"
                className="p-2 border rounded"
                autoComplete="new-password"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <CustomButton
                text="Cancel"
                onClick={() => setEditModal({ open: false, provider: null })}
              />
              <CustomButton text="Save" type="submit" />
            </div>
          </form>
        )}
      </div>
    </Modal>
  </div>
);

export default AdminProviderCrudView;
