import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServiceRequests } from "../model/admin";
import {
  setRequests,
  setLoading,
  setError,
  removeRequest,
} from "../store/adminRequestsSlice";

export const useAdminServiceRequestCrudViewModel = () => {
  const dispatch = useDispatch();
  const { requests, loaded, loading, error } = useSelector(
    (state) => state.adminRequests
  );
  const [modal, setModal] = useState({
    open: false,
    requestId: null,
    action: null,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loaded) {
      dispatch(setLoading(true));
      getAllServiceRequests()
        .then((res) => dispatch(setRequests(res.data.requests || [])))
        .catch(() => dispatch(setError("Failed to load service requests")));
    }
  }, [loaded, dispatch]);

  const handleDeactivate = (requestId) => {
    setModal({ open: true, requestId, action: "deactivate" });
  };
  const handleDelete = (requestId) => {
    setModal({ open: true, requestId, action: "delete" });
  };
  const confirmAction = () => {
    // Add deactivate/delete logic here
    setModal({ open: false, requestId: null, action: null });
  };

  // Add a refresh function for after update
  const refreshRequests = async () => {
    const res = await getAllServiceRequests();
    dispatch(setRequests(res.data.requests || []));
  };

  const filteredRequests = requests.filter(
    (req) =>
      req._id.toLowerCase().includes(search.toLowerCase()) ||
      (req.status && req.status.toLowerCase().includes(search.toLowerCase()))
  );

  return {
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
    refreshRequests,
  };
};
