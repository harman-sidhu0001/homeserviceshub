import React from "react";
import CustomButton from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";

const AdminServiceRequestCrudView = ({
  loading,
  error,
  search,
  setSearch,
  filteredRequests,
  handleDeactivate,
  handleDelete,
  modal,
  setModal,
  confirmAction,
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">All Service Requests</h2>
    <input
      type="text"
      placeholder="Search by request ID or status..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="mb-4 p-2 border rounded w-full"
    />
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      <ul>
        {filteredRequests.map((req) => (
          <li
            key={req._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>
              {req._id} - {req.status}
            </span>
            <div className="flex gap-2">
              <CustomButton text="Edit" onClick={() => {}} />
              <CustomButton
                text="Deactivate"
                onClick={() => handleDeactivate(req._id)}
              />
              <CustomButton
                text="Delete"
                onClick={() => handleDelete(req._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    )}
    <Modal
      open={modal.open}
      onClose={() => setModal({ open: false, requestId: null, action: null })}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {modal.action === "delete"
            ? "Are you sure you want to delete this service request?"
            : "Are you sure you want to deactivate this service request?"}
        </h3>
        <div className="flex gap-4 mt-4">
          <CustomButton
            text="Cancel"
            onClick={() =>
              setModal({ open: false, requestId: null, action: null })
            }
          />
          <CustomButton text="Confirm" onClick={confirmAction} />
        </div>
      </div>
    </Modal>
  </div>
);

export default AdminServiceRequestCrudView;
