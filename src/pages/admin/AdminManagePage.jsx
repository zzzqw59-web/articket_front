import AdminManageMemberComponent from "../../components/admin/AdminManageMemberComponent";
import AdminFloatingNavigator from "./AdminFloatingNavigator";

const AdminManagePage = () => {
  return (
    <>
      <AdminManageMemberComponent />
      <div className="h-10"></div>

      <div className="h-10"></div>
      <AdminFloatingNavigator isMain={false} />
    </>
  );
};

export default AdminManagePage;
