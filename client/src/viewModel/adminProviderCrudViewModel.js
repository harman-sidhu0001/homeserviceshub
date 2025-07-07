import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProviders,
  deactivateUser,
  updateProviderByAdmin,
  deleteProviderByAdmin,
  activateProvider,
} from "../model/admin";
import { uploadProfilePhoto } from "../model/upload";
import { getServices } from "../model/services";
import {
  setProviders,
  setLoading,
  setError,
  removeProvider,
} from "../store/adminProvidersSlice";

export const useAdminProviderCrudViewModel = () => {
  const dispatch = useDispatch();
  const { providers, loaded, loading, error } = useSelector(
    (state) => state.adminProviders
  );
  const [modal, setModal] = useState({
    open: false,
    providerId: null,
    action: null,
  });
  const [providerSearch, setProviderSearch] = useState("");
  const [editModal, setEditModal] = useState({ open: false, provider: null });
  const [editForm, setEditForm] = useState(null);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    if (!loaded) {
      dispatch(setLoading(true));
      getAllProviders()
        .then((res) => dispatch(setProviders(res.data.providers || [])))
        .catch(() => dispatch(setError("Failed to load providers")));
    }
  }, [loaded, dispatch]);

  useEffect(() => {
    getServices().then((services) => setAllServices(services || []));
  }, []);

  const handleDeactivate = (providerId) => {
    setModal({ open: true, providerId, action: "deactivate" });
  };
  const handleDelete = (providerId) => {
    setModal({ open: true, providerId, action: "delete" });
  };
  const handleEdit = (provider) => {
    const p = provider.providerProfile || {};
    setEditForm({
      _id: provider._id,
      companyName: p.companyName || "",
      providerEmail: p.providerEmail || provider.email || "",
      phone: p.phone || provider.phone || "",
      location: p.location || "",
      profilePhoto: p.profilePhoto || "",
      intro: p.intro || "",
      projectsDone: p.projectsDone || 0,
      projectsOngoing: p.projectsOngoing || 0,
      yearOfEstablishment: p.yearOfEstablishment || 0,
      subscriptionPlan: p.subscriptionPlan || "",
      paymentMethods: (p.paymentMethods || []).join(", "),
      services: Array.isArray(p.services)
        ? p.services
        : p.services
        ? p.services.split(",").map((s) => s.trim())
        : [],
      serviceAreas: (p.serviceAreas || []).join(", "),
      totalWorkers: p.totalWorkers || 0,
      gallery: (p.gallery || []).join(", "),
      awards: (p.awards || []).join(", "),
      newPassword: "",
    });
    setEditModal({ open: true, provider });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto" && files && files[0]) {
      setEditForm((prev) => ({ ...prev, profilePhoto: files[0] }));
    } else if (name === "services") {
      setEditForm((prev) => ({ ...prev, services: value }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm || !editForm._id) return;
    let updated = { ...editForm };
    // Handle profile photo upload
    if (editForm.profilePhoto && editForm.profilePhoto instanceof File) {
      const formData = new FormData();
      formData.append("profilePhoto", editForm.profilePhoto);
      const res = await uploadProfilePhoto(formData);
      updated.profilePhoto = res.data?.url || res.data?.profilePhoto || "";
    }
    // If newPassword is set, send it to backend
    if (editForm.newPassword) {
      updated.password = editForm.newPassword;
    }
    // Convert comma separated fields to arrays
    updated.paymentMethods = updated.paymentMethods
      ? updated.paymentMethods.split(",").map((s) => s.trim())
      : [];
    updated.services = Array.isArray(updated.services)
      ? updated.services
      : updated.services
      ? updated.services.split(",").map((s) => s.trim())
      : [];
    updated.serviceAreas = updated.serviceAreas
      ? updated.serviceAreas.split(",").map((s) => s.trim())
      : [];
    updated.gallery = updated.gallery
      ? updated.gallery.split(",").map((s) => s.trim())
      : [];
    updated.awards = updated.awards
      ? updated.awards.split(",").map((s) => s.trim())
      : [];
    delete updated.newPassword;
    await updateProviderByAdmin(editForm._id, updated);
    // Refresh provider list after update
    const res = await getAllProviders();
    dispatch(setProviders(res.data.providers || []));
    setEditModal({ open: false, provider: null });
    setEditForm(null);
  };

  const confirmAction = async () => {
    if (modal.action === "deactivate") {
      await deactivateUser(modal.providerId);
      dispatch(removeProvider(modal.providerId));
      setModal({ open: false, providerId: null, action: null });
    } else if (modal.action === "delete") {
      await deleteProviderByAdmin(modal.providerId);
      dispatch(removeProvider(modal.providerId));
      setModal({ open: false, providerId: null, action: null });
    }
  };

  const handleActivate = (providerId) => {
    activateProvider(providerId).then(() => {
      dispatch(
        setProviders(
          providers.map((p) =>
            p._id === providerId ? { ...p, isActive: true } : p
          )
        )
      );
    });
  };

  const filteredProviders = providers.filter((provider) => {
    const p = provider.providerProfile || {};
    const search = providerSearch.toLowerCase();
    return (
      (p.companyName && p.companyName.toLowerCase().includes(search)) ||
      (p.phone && p.phone.toLowerCase().includes(search)) ||
      (provider.phone && provider.phone.toLowerCase().includes(search))
    );
  });

  return {
    loading,
    error,
    providerSearch,
    setProviderSearch,
    filteredProviders,
    handleDeactivate,
    handleDelete,
    handleActivate,
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
  };
};
