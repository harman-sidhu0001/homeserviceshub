import React, { useState } from "react";
import CustomButton from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import ProfilePhotoInput from "../../components/common/ProfilePhotoInput.jsx";

const AdminUserCrudView = ({
  loading,
  error,
  userSearch,
  setUserSearch,
  filteredUsers,
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
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <div>
      <h3 className="text-xl font-bold mb-2">Users</h3>
      <input
        type="text"
        placeholder="Search users by email..."
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul>
          {filteredUsers.map((user) => {
            const isActive = user.isActive !== false;
            return (
              <li
                key={user._id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {user.email} |{" "}
                  {user.phone || user.userProfile?.phone || "No phone"}
                  {!isActive && (
                    <span className="ml-2 text-xs text-red-500">
                      (Inactive)
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <CustomButton
                    text="Edit Profile"
                    onClick={() => handleEdit(user)}
                  />
                  <CustomButton
                    text={isActive ? "Deactivate" : "Activate"}
                    onClick={() =>
                      isActive
                        ? handleDeactivate(user._id)
                        : handleActivate(user._id)
                    }
                  />
                  <CustomButton
                    text="Delete"
                    onClick={() => handleDelete(user._id)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    {/* Deactivate/Delete Modal */}
    <Modal
      open={modal.open}
      onClose={() => setModal({ open: false, userId: null, action: null })}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {modal.action === "delete"
            ? "Are you sure you want to delete this profile?"
            : "Are you sure you want to deactivate this profile?"}
        </h3>
        <div className="flex gap-4 mt-4">
          <CustomButton
            text="Cancel"
            onClick={() =>
              setModal({ open: false, userId: null, action: null })
            }
          />
          <CustomButton text="Confirm" onClick={confirmAction} />
        </div>
      </div>
    </Modal>
    {/* Edit Profile Modal */}
    <Modal
      open={editModal.open}
      onClose={() => setEditModal({ open: false, user: null })}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Edit User Profile</h3>
        {editForm && (
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-3"
            autoComplete="off"
          >
            <input
              type="text"
              name="fullName"
              value={editForm.fullName || ""}
              onChange={handleEditChange}
              placeholder="Full Name"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="email"
              value={editForm.email || ""}
              onChange={handleEditChange}
              placeholder="Email"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="phone"
              value={editForm.phone || ""}
              onChange={handleEditChange}
              placeholder="Phone"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={editForm.location || ""}
              onChange={handleEditChange}
              placeholder="Location"
              className="p-2 border rounded"
            />
            <ProfilePhotoInput
              value={editForm.profilePhoto}
              onChange={handleEditChange}
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
                onClick={() => setEditModal({ open: false, user: null })}
              />
              <CustomButton text="Save" type="submit" />
            </div>
          </form>
        )}
      </div>
    </Modal>
  </div>
);

export default AdminUserCrudView;
