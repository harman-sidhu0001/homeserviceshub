import React from "react";
import AdminServiceRequestCrudView from "../view/adminView/AdminServiceRequestCrudView";
import { useAdminServiceRequestCrudViewModel } from "../viewModel/adminServiceRequestCrudViewModel";

const AdminServiceRequestCrud = () => {
  const viewModel = useAdminServiceRequestCrudViewModel();
  return <AdminServiceRequestCrudView {...viewModel} />;
};

export default AdminServiceRequestCrud;
