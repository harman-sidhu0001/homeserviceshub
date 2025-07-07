import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deactivateUser,
  updateUserByAdmin,
  deleteUserByAdmin,
  activateUser,
} from "../model/admin";
import { uploadProfilePhoto } from "../model/upload";
import {
  setUsers,
  setLoading,
  setError,
  removeUser,
} from "../store/adminUsersSlice";

export const useAdminUserCrudViewModel = () => {
  const dispatch = useDispatch();
  const { users, loaded, loading, error } = useSelector(
    (state) => state.adminUsers
  );
  const [modal, setModal] = useState({
    open: false,
    userId: null,
    action: null,
  });
  const [userSearch, setUserSearch] = useState("");
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!loaded) {
      dispatch(setLoading(true));
      getAllUsers()
        .then((res) => dispatch(setUsers(res.data.users || [])))
        .catch(() => dispatch(setError("Failed to load users")));
    }
  }, [loaded, dispatch]);

  const handleDeactivate = (userId) => {
    setModal({ open: true, userId, action: "deactivate" });
  };
  const handleDelete = (userId) => {
    setModal({ open: true, userId, action: "delete" });
  };
  const handleEdit = (user) => {
    setEditForm({
      _id: user._id,
      fullName: user.userProfile?.fullName || "",
      email: user.email || user.userProfile?.email || "",
      phone: user.phone || user.userProfile?.phone || "",
      location: user.userProfile?.location || "",
      profilePhoto: user.userProfile?.profilePhoto || "",
      newPassword: "",
    });
    setEditModal({ open: true, user });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto" && files && files[0]) {
      setEditForm((prev) => ({ ...prev, profilePhoto: files[0] }));
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
    delete updated.newPassword;
    await updateUserByAdmin(editForm._id, updated);
    // Refresh user list after update
    const res = await getAllUsers();
    dispatch(setUsers(res.data.users || []));
    setEditModal({ open: false, user: null });
    setEditForm(null);
  };

  const confirmAction = async () => {
    if (modal.action === "deactivate") {
      await deactivateUser(modal.userId);
      dispatch(removeUser(modal.userId));
      setModal({ open: false, userId: null, action: null });
    } else if (modal.action === "delete") {
      await deleteUserByAdmin(modal.userId);
      dispatch(removeUser(modal.userId));
      setModal({ open: false, userId: null, action: null });
    }
  };

  const handleActivate = (userId) => {
    activateUser(userId).then(() => {
      dispatch(
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, isActive: true } : u))
        )
      );
    });
  };

  const filteredUsers = users.filter((user) =>
    user?.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return {
    loading,
    error,
    userSearch,
    setUserSearch,
    filteredUsers,
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
  };
};
