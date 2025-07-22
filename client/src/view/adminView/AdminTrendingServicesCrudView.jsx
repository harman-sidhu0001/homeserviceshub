import { useAdminTrendingServicesCrudViewModel } from "../../viewModel/adminTrendingServicesCrudViewModel";
import Modal from "../../components/common/Modal";
import CustomButton from "../../components/common/Button";

const AdminTrendingServicesCrudView = () => {
  const {
    services,
    loading,
    error,
    editing,
    isModalOpen,
    form,
    submitting,
    handleChange,
    handleSubmit,
    startEdit,
    cancelEdit,
    handleDelete,
    startAdd,
    servicesList,
  } = useAdminTrendingServicesCrudViewModel();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Trending Services</h1>

      <Modal open={isModalOpen} onClose={cancelEdit}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <h2 className="text-xl font-bold mb-4">
            {editing ? "Update" : "Add"} Trending Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={submitting}
              >
                <option value="">Select a service</option>
                {servicesList.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Icon</label>
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={submitting}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block font-medium">
                Locations (comma separated)
              </label>
              <input
                type="text"
                name="locations"
                value={form.locations}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block font-medium">
                Similar Words (comma separated)
              </label>
              <input
                type="text"
                name="similarWords"
                value={form.similarWords}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={submitting}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">URL</label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={submitting}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={submitting}
            >
              {editing ? "Update" : "Add"} Service
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              onClick={cancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded shadow p-6">
        <CustomButton
          text="Add New Trending Service"
          onClick={startAdd}
          disabled={submitting}
          width="auto"
          className="mb-4"
        />

        <h2 className="text-xl font-semibold mb-4">Trending Services List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : services.length === 0 ? (
          <div>No trending services found.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Icon</th>
                <th className="p-2 border">Locations</th>
                <th className="p-2 border">Similar Words</th>
                <th className="p-2 border">URL</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="p-2 border font-semibold">{service.name}</td>
                  <td className="p-2 border">{service.description}</td>
                  <td className="p-2 border">{service.icon}</td>
                  <td className="p-2 border">{service.locations.join(", ")}</td>
                  <td className="p-2 border">
                    {service.similarWords.join(", ")}
                  </td>
                  <td className="p-2 border">{service.url}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => startEdit(service)}
                      disabled={submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(service._id)}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminTrendingServicesCrudView;
