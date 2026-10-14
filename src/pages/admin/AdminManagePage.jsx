import AdminAuthBoard from "../../components/admin/AdminAuthBoard";
import AdminManageAskComponent from "../../components/admin/AdminManageAskComponent";
import AdminManageMemberComponent from "../../components/admin/AdminManageMemberComponent";
import AdminFloatingNavigator from "./AdminFloatingNavigator";

const AdminManagePage = () => {
  return (
    <>
      <div className="h-10"></div>
      <AdminManageMemberComponent />
      <div className="h-10"></div>
      <AdminAuthBoard />
      <div className="h-10"></div>
      <AdminManageAskComponent />
      <AdminFloatingNavigator isMain={false} />
      <div className="h-10"></div>
    </>
  );
};

export default AdminManagePage;
