import React from "react";
import AdminUserCrudView from "../view/adminView/AdminUserCrudView";
import { useAdminUserCrudViewModel } from "../viewModel/adminUserCrudViewModel";

const AdminUserCrud = () => {
  const viewModel = useAdminUserCrudViewModel();
  return <AdminUserCrudView {...viewModel} />;
};

export default AdminUserCrud;
