import { useEffect, useState } from "react";
import {
  getAllTrendingServices,
  createTrendingService,
  updateTrendingService,
  deleteTrendingService,
} from "../model/trendingServices";
import { getServices } from "../model/services";

export const useAdminTrendingServicesCrudViewModel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // service being edited or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "FaTools",
    locations: "",
    similarWords: "",
    url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  // Fetch all trending services
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTrendingServices();
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available services for dropdown
  const fetchServicesList = async () => {
    try {
      const data = await getServices();
      setServicesList(data);
    } catch (err) {
      setServicesList([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServicesList();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // If changing the name field and adding (not editing), auto-fill other fields
      if (name === "name" && editing === null) {
        const selected = servicesList.find((s) => s.name === value);
        if (selected) {
          return {
            ...prev,
            name: selected.name,
            description: selected.description || "",
            icon: selected.icon || "FaTools",
            locations: (selected.locations || []).join(", "),
            similarWords: (selected.similarWords || []).join(", "),
            url: selected.url || "",
          };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  // Start editing a service
  const startEdit = (service) => {
    setEditing(service._id);
    setForm({
      name: service.name,
      description: service.description,
      icon: service.icon,
      locations: service.locations.join(", "),
      similarWords: service.similarWords.join(", "),
      url: service.url || "",
    });
    setIsModalOpen(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      icon: "FaTools",
      locations: "",
      similarWords: "",
      url: "",
    });
    setIsModalOpen(false);
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        locations: form.locations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        similarWords: form.similarWords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editing) {
        await updateTrendingService(editing, payload);
      } else {
        await createTrendingService(payload);
      }
      await fetchServices();
      cancelEdit();
    } catch (err) {
      setError(err.message || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a service
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this trending service?")
    )
      return;
    setSubmitting(true);
    try {
      await deleteTrendingService(id);
      await fetchServices();
    } catch (err) {
      setError(err.message || "Failed to delete service");
    } finally {
      setSubmitting(false);
    }
  };

  // Start adding a new service
  const startAdd = () => {
    setEditing(null); // Set to null for add mode
    setForm({
      name: "",
      description: "",
      icon: "FaTools",
      locations: "",
      similarWords: "",
      url: "",
    });
    setIsModalOpen(true);
  };

  return {
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
  };
};
