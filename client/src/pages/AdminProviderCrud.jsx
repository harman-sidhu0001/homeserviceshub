import React from "react";
import AdminProviderCrudView from "../view/adminView/AdminProviderCrudView";
import { useAdminProviderCrudViewModel } from "../viewModel/adminProviderCrudViewModel";

const AdminProviderCrud = () => {
  const viewModel = useAdminProviderCrudViewModel();
  return <AdminProviderCrudView {...viewModel} />;
};

export default AdminProviderCrud;
